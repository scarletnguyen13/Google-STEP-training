// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.sps.servlets.models.Comment;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFutureCallback;
import com.google.api.core.ApiFutures;
import com.google.api.gax.rpc.ApiException;
import com.google.cloud.pubsub.v1.Publisher;
import com.google.cloud.pubsub.v1.TopicAdminClient;
import com.google.common.util.concurrent.MoreExecutors;
import com.google.protobuf.ByteString;
import com.google.pubsub.v1.ProjectTopicName;
import com.google.pubsub.v1.PubsubMessage;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

@WebServlet("/comment")
public class CommentServlet extends HttpServlet {

  private static final String PROJECT_ID = "scarletnguyen-step-2020";
  private static final String TOPIC_ID = "comment-updates";

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");
    String json = getAllCommentsInJson();
    response.getWriter().print(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String requestData = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
    String commentString = requestData.replaceAll("(\r\n|\n)", "<br />");
    Entity commentEntity = Comment.createCommentEntity(commentString);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentEntity);
    doGet(request, response);

    ProjectTopicName commentUpdates = ProjectTopicName.of(PROJECT_ID, TOPIC_ID);
    Publisher publisher = null;
    List<ApiFuture<String>> futures = new ArrayList<>();

    try {
      // Create a publisher instance with default settings bound to the topic
      publisher = Publisher.newBuilder(commentUpdates).build();
      String message = "new comment created";

      ByteString data = ByteString.copyFromUtf8(message);
      PubsubMessage pubsubMessage = PubsubMessage.newBuilder().setData(data).build();

      // Once published, returns a server-assigned message id (unique within the topic)
      ApiFuture<String> future = publisher.publish(pubsubMessage);
      
      // Add an asynchronous callback to handle success / failure
      ApiFutures.addCallback(
        future,
        new ApiFutureCallback<String>() {

          @Override
          public void onFailure(Throwable throwable) {
            if (throwable instanceof ApiException) {
              ApiException apiException = ((ApiException) throwable);
              // details on the API exception
              System.out.println(apiException.getStatusCode().getCode());
              System.out.println(apiException.isRetryable());
            }
            System.out.println("Error publishing message : " + message);
          }

          @Override
          public void onSuccess(String messageId) {
            // Once published, returns server-assigned message ids (unique within the topic)
            System.out.println(messageId);
          }
        },
        MoreExecutors.directExecutor());
      
    } finally {
      if (publisher != null) {
        // When finished with the publisher, shutdown to free up resources.
        publisher.shutdown();
        // publisher.awaitTermination(1, TimeUnit.MINUTES);
      }
    }
  }

  @Override
  public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Query query = new Query("Comment").setKeysOnly();
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);
    for (Entity entity : results.asIterable()) {
      datastore.delete(entity.getKey());
    }
  }

  private String getAllCommentsInJson() {
    Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    List<Comment> comments = new ArrayList<>();
    for (Entity entity : results.asIterable()) {
      Comment comment = Comment.convertEntityToComment(entity);
      comments.add(comment);
    }
    
    String json = Comment.convertToJson(comments);
    return json;
  }
}
