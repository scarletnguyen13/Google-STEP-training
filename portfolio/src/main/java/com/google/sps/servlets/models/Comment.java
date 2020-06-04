package com.google.sps.servlets.models;

import com.google.appengine.api.datastore.Entity;
import java.util.List;
import com.google.gson.Gson;

public class Comment {
  private long id;
  private long timestamp;
  private String userId;
  private String username;
  private String content;
  private int likes;

  public Comment(
    long id, long timestamp, 
    String userId, String username, String content, 
    int likes
  ) {
    this.id = id;
    this.timestamp = timestamp;
    this.userId = userId;
    this.username = username;
    this.content = content;
    this.likes = likes;
  }

  public static Comment convertEntityToComment(Entity entity) {
    long id = entity.getKey().getId();
    long timestamp = (long) entity.getProperty("timestamp");
    String userId = (String) entity.getProperty("userId");
    String username = (String) entity.getProperty("username");
    String content = (String) entity.getProperty("content");
    int likes = (int) (long) entity.getProperty("likes");

    Comment comment = new Comment(id, timestamp, userId, username, content, likes);
    return comment;
  }

  public static Entity createCommentEntity(String userId, String username, String content) {
    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("timestamp", System.currentTimeMillis());
    commentEntity.setProperty("userId", userId);
    commentEntity.setProperty("username", username);
    commentEntity.setProperty("content", content);
    commentEntity.setProperty("likes", 0);
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
}