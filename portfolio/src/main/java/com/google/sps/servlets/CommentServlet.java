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
import com.google.sps.servlets.models.RequestData;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

import javax.servlet.annotation.MultipartConfig;
import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.FirebaseAuthException;

@WebServlet("/comment")
@MultipartConfig 
public class CommentServlet extends HttpServlet {

  public CommentServlet() {
    FirebaseApp.initializeApp();
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");
    List<Comment> comments = Comment.getAll();
    String json = Comment.convertToJson(comments);
    response.getWriter().print(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    RequestData requestData = new RequestData(request);
    String tokenId = request.getParameter("id");
    try {
      String userId = verifyAndGetUserId(tokenId);
      boolean isSucceeded = Comment.insertOne(userId, requestData);
      if (isSucceeded) doGet(request, response);
      else response.getWriter().print("Failed to post comment. Please try again");
    } catch (FirebaseAuthException e) {
      e.printStackTrace();
    }
  }

  @Override
  public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String tokenId = request.getParameter("id");
    try {
      String userId = verifyAndGetUserId(tokenId);
      boolean isSucceeded = Comment.deleteAll(userId);
      if (isSucceeded) doGet(request, response);
      else response.getWriter().print("Failed to delete comments. Please try again");
    } catch (FirebaseAuthException e) {
      e.printStackTrace();
    }
  }

  private String verifyAndGetUserId(String tokenId) throws FirebaseAuthException {
    FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(tokenId);
    String userId = decodedToken.getUid();
    return userId;
  }
}
