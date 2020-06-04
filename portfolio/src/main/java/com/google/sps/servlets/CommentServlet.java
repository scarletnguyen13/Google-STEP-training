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
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Query.FilterOperator;
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
import java.util.Arrays;
import java.util.stream.Collectors;

@WebServlet("/comment")
public class CommentServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");

    Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    List<Comment> comments = new ArrayList<>();
    for (Entity entity : results.asIterable()) {
      Comment comment = Comment.convertEntityToComment(entity);
      comments.add(comment);
    }
    
    String json = Comment.convertToJson(comments);
    response.getWriter().print(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String[] requestData = request.getReader().lines().collect(Collectors.joining(System.lineSeparator())).split("\\n+");
    String[] commentData = getCommentData(requestData);
    String userId = request.getParameter("user");
    String username = commentData[0];
    String content = commentData[1];
    Entity commentEntity = Comment.createCommentEntity(userId, username, content);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentEntity);
    doGet(request, response);
  }

  @Override
  public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String userId = request.getParameter("user");
    Filter matchedUserIdFilter = new FilterPredicate("userId", FilterOperator.EQUAL, userId);
    Query query = new Query("Comment")
      .setFilter(matchedUserIdFilter)
      .setKeysOnly();
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);
    for (Entity entity : results.asIterable()) {
      datastore.delete(entity.getKey());
    }
    doGet(request, response);
  }

  private String[] getCommentData(String[] requestData) {
    List<String> dataList = Arrays.asList(requestData);
    String initials = "Content-Disposition: form-data; ";
    int usernameValueIndex = dataList.indexOf(initials + "name=\"username\"") + 1;
    int contentValueIndex = dataList.indexOf(initials + "name=\"content\"") + 1;
    return new String[] {
      dataList.get(usernameValueIndex),
      dataList.get(contentValueIndex),
    };
  }
}
