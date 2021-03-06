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

import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.sps.servlets.models.Comment;
import com.google.sps.servlets.models.PubSubUtils;
import com.google.sps.servlets.models.RequestData;

import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet("/comment")
@MultipartConfig 
public class CommentServlet extends HttpServlet {
  private final static Logger LOGGER = Logger.getLogger(CommentServlet.class.getName());

  private static final String TOPIC_NAME = "comment-updates";

  public CommentServlet() {
    FirebaseApp.initializeApp();
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");
    String json = getAllCommentsInJson();
    response.getWriter().print(json);
  }

  @Override
  // @MultipartConfig
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    RequestData requestData = new RequestData(request);
    String tokenId = request.getParameter("id");
    try {
      FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(tokenId);
      String userId = decodedToken.getUid();
      Entity commentEntity = Comment.createCommentEntity(
        userId, requestData.get("username"), requestData.get("content")
      );
      DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
      datastore.put(commentEntity);
      
      String commentJson = Comment.convertToJson(commentEntity);
      PubSubUtils.publish(TOPIC_NAME, commentJson);
    } catch (FirebaseAuthException e) {
      LOGGER.log(Level.SEVERE, e.toString(), e);
    } catch (NoSuchElementException e) {
      LOGGER.log(Level.SEVERE, e.toString(), e);
    }
  }

  @Override
  public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String tokenId = request.getParameter("id");
    try {
      FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(tokenId);
      String userId = decodedToken.getUid();
      Filter matchedUserIdFilter = new FilterPredicate("userId", FilterOperator.EQUAL, userId);
      Query query = new Query("Comment")
        .setFilter(matchedUserIdFilter);
      DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
      PreparedQuery results = datastore.prepare(query);
      for (Entity commentEntity : results.asIterable()) {
        commentEntity.setProperty("status", Comment.Status.DELETED.name());
        datastore.put(commentEntity);
      }
      String message = String.format("{ \"message\":  \"deleted\", \"userId\": \"%s\" }", userId); 
      PubSubUtils.publish(TOPIC_NAME, message);
    } catch (FirebaseAuthException e) {
      LOGGER.log(Level.SEVERE, e.toString(), e);
    }
  }

  private String getAllCommentsInJson() {
    Filter publicOnlyFilter = new FilterPredicate(
      "status", FilterOperator.EQUAL, Comment.Status.PUBLIC.name()
    );
    Query query = new Query("Comment")
      .setFilter(publicOnlyFilter)
      .addSort("timestamp", SortDirection.DESCENDING);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    List<Comment> comments = new ArrayList<>();
    for (Entity entity : results.asIterable()) {
      Comment comment = Comment.fromEntity(entity);
      comments.add(comment);
    }
    
    String json = Comment.convertToJson(comments);
    return json;
  }
}
