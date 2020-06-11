package com.google.sps.servlets.models;

import com.google.appengine.api.datastore.Entity;
import java.util.List;
import java.util.Arrays;
import com.google.gson.Gson;

public class Comment {
  public enum Status { PUBLIC, DELETED };

  private long id;
  private long timestamp;
  private String userId;
  private String username;
  private String content;
  private int likes;
  private Status status;

  public Comment(
    long id, 
    long timestamp, 
    String userId, 
    String username, 
    String content, 
    int likes,
    Status status
  ) {
    this.id = id;
    this.timestamp = timestamp;
    this.userId = userId;
    this.username = username;
    this.content = content;
    this.likes = likes;
    this.status = status;
  }

  public static Comment fromEntity(Entity entity) {
    long id = entity.getKey().getId();
    long timestamp = (long) entity.getProperty("timestamp");
    String userId = (String) entity.getProperty("userId");
    String username = (String) entity.getProperty("username");
    String content = (String) entity.getProperty("content");
    // Convert "likes" property to long then cast as int
    int likes = (int) (long) entity.getProperty("likes");
    Status status = Status.valueOf((String) entity.getProperty("status"));

    Comment comment = new Comment(id, timestamp, userId, username, content, likes, status);
    return comment;
  }

  public static Entity createCommentEntity(String userId, String username, String content) {
    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("timestamp", System.currentTimeMillis());
    commentEntity.setProperty("userId", userId);
    commentEntity.setProperty("username", username);
    commentEntity.setProperty("content", content);
    // "likes" property will be automatically converted to datastore's native 
    // type => long instead of int (according to the documentation)
    commentEntity.setProperty("likes", 0); 
    commentEntity.setProperty("status", Status.PUBLIC.name());
    return commentEntity;
  }

  /**
   * Converts a ServerStats instance into a JSON string using the Gson library.
   */
  public static String convertToJson(List<Comment> comments) {
    Gson gson = new Gson();
    String json = gson.toJson(comments);
    return json;
  }
  
  public static String convertToJson(Entity comment) {
    Gson gson = new Gson();
    String json = gson.toJson(comment.getProperties());
    return json;
  }
}