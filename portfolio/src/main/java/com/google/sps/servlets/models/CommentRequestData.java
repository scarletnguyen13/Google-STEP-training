package com.google.sps.servlets.models;

import com.google.sps.servlets.models.Utils;
import com.google.appengine.api.datastore.Entity;
import java.util.List;
import java.util.Arrays;
import com.google.gson.Gson;
import java.util.Map;

public class CommentRequestData {
  private final String username;
  private final String content;

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

  public static CommentRequestData fromRequestString(String requestString) {
    String[] params = { "username", "content" };
    Map<String, String> extractedData = Utils.extractFrom(requestString, params);
    return new CommentRequestData(
      extractedData.get(params[0]), 
      extractedData.get(params[1])
    );
  }
}