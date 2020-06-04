package com.google.sps.servlets.models;

import com.google.appengine.api.datastore.Entity;
import java.util.List;
import java.util.Arrays;
import com.google.gson.Gson;

public class CommentRequestData {
  private String username;
  private String content;

  public CommentRequestData(String username, String content) {
    this.username = username;
    this.content = content;
  }

  public String getUsername() {
    return this.username;
  }

  public String getContent() {
    return this.content;
  }

  public static CommentRequestData extractCommentData(String requestString) {
    List<String> dataList = Arrays.asList(requestString.split("\\n+"));

    String initials = "Content-Disposition: form-data; ";
    int usernameValueIndex = dataList.indexOf(initials + "name=\"username\"") + 1;
    int contentValueIndex = dataList.indexOf(initials + "name=\"content\"") + 1;
    
    String usernameRequestData = dataList.get(usernameValueIndex);
    String contentRequestData = dataList.get(contentValueIndex);
    return new CommentRequestData(usernameRequestData, contentRequestData);
  }
}