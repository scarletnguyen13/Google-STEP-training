package com.google.sps.servlets.models;

import com.google.appengine.api.datastore.Entity;
import java.util.List;
import com.google.gson.Gson;

public class Comment {
  private long id;
  private long timestamp;
  private String username;
  private String content;
  private int likes;

  public Comment(long id, long timestamp, String username, String content, int likes) {
    this.id = id;
    this.timestamp = timestamp;
    this.username = username;
    this.content = content;
    this.likes = likes;
  }

  public static Comment convertEntityToComment(Entity entity) {
    long id = entity.getKey().getId();
    long timestamp = (long) entity.getProperty("timestamp");
    String username = (String) entity.getProperty("username");
    String content = (String) entity.getProperty("content");
    int likes = (int) entity.getProperty("likes");

    Comment comment = new Comment(id, timestamp, username, content, likes);
    return comment;
  }

  public static Entity createCommentEntity(String content) {
    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("timestamp", System.currentTimeMillis());
    commentEntity.setProperty("username", RandomNameGenerator.generate());
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