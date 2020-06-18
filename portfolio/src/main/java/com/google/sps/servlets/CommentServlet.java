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

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.sps.servlets.models.Comment;
import com.google.sps.servlets.models.CommentReader;
import com.google.sps.servlets.models.PubSubUtils;
import com.google.sps.servlets.models.RequestData;

import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
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
    List<Comment> comments = CommentReader.getAll();
    String json = Comment.convertToJson(comments);
    response.getWriter().print(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    RequestData requestData = new RequestData(request);
    String tokenId = request.getParameter("id");
    try {
      String userId = verifyAndGetUserId(tokenId);
      String responseJson = CommentReader.insertOne(userId, requestData);
      if (responseJson.startsWith("Failed")) {
        response.getWriter().print(responseJson);
      } else {
        PubSubUtils.publish(TOPIC_NAME, responseJson);
      }
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
      String userId = verifyAndGetUserId(tokenId);
      String responseJson = CommentReader.deleteAll(userId);
      if (responseJson.startsWith("Failed")) {
        response.getWriter().print(responseJson);
      } else {
        PubSubUtils.publish(TOPIC_NAME, responseJson);
      }
    } catch (FirebaseAuthException e) {
      LOGGER.log(Level.SEVERE, e.toString(), e);
    }
  }

  private String verifyAndGetUserId(String tokenId) throws FirebaseAuthException {
    FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(tokenId);
    String userId = decodedToken.getUid();
    return userId;
  }
}
