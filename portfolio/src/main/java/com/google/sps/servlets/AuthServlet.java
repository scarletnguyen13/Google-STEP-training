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

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Arrays;

@WebServlet("/auth")
public class AuthServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("text/html");
    UserService userService = UserServiceFactory.getUserService();
    response.getWriter().print(userService.isUserLoggedIn() + "");
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String[] requestData = request.getReader().lines().collect(Collectors.joining(" ")).split("\\s+");
    String[] userData = getUserData(requestData);
    String email = userData[0];
    String password = userData[1];
    
  }

  private String[] getUserData(String[] requestData) {
    List<String> dataList = Arrays.asList(requestData);
    int emailValueIndex = dataList.indexOf("name=\"email\"") + 1;
    int passwordValueIndex = dataList.indexOf("name=\"password\"") + 1;
    return new String[] {
      dataList.get(emailValueIndex), 
      dataList.get(passwordValueIndex)
    };
  }
}
