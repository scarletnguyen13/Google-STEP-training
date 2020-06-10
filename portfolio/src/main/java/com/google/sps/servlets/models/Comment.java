package com.google.sps.servlets.models;

import com.google.sps.servlets.models.RequestData;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Transaction;
import com.google.appengine.api.datastore.TransactionOptions.Builder;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.gson.Gson;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.stream.Collectors;
import java.util.NoSuchElementException;

public class Comment {
  public enum Status { PUBLIC, DELETED };
  private static final DatastoreService DATASTORE = DatastoreServiceFactory.getDatastoreService();

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

  public static List<Comment> getAll() {
    Filter publicOnlyFilter = new FilterPredicate(
      "status", FilterOperator.EQUAL, Comment.Status.PUBLIC.name()
    );
    Query query = new Query("Comment")
      .setFilter(publicOnlyFilter)
      .addSort("timestamp", SortDirection.DESCENDING);

    PreparedQuery results = DATASTORE.prepare(query);

    List<Comment> comments = new ArrayList<>();
    for (Entity entity : results.asIterable()) {
      Comment comment = Comment.fromEntity(entity);
      comments.add(comment);
    }
    return comments;
  }

  public static boolean insertOne(String userId, RequestData requestData) {
    Transaction transaction = DATASTORE.beginTransaction();
    try {
      Entity commentEntity = Comment.createCommentEntity(
        userId, requestData.get("username"), requestData.get("content")
      );
      DATASTORE.put(transaction, commentEntity);
      transaction.commit();
    } catch (NoSuchElementException e) {
      e.printStackTrace();
    } finally {
      return hasSucceeded(transaction);
    }
  }

  public static boolean deleteAll(String userId) {
    Transaction transaction = DATASTORE.beginTransaction(Builder.withXG(true));

    Filter matchedUserIdFilter = new FilterPredicate("userId", FilterOperator.EQUAL, userId);
    Query query = new Query("Comment").setFilter(matchedUserIdFilter);
    PreparedQuery results = DATASTORE.prepare(query);

    FetchOptions fetchOptions = FetchOptions.Builder.withDefaults();
    List<Entity> updatedComments = results.asList(fetchOptions).stream()
      .map(entity -> {
        entity.setProperty("status", Comment.Status.DELETED.name());
        return entity;
      })
      .collect(Collectors.toList());

    try {
      // Batch update
      DATASTORE.put(transaction, updatedComments);
      transaction.commit();
    } finally {
      return hasSucceeded(transaction);
    }
  }

  // Rollback and returns false if failed, true otherwise
  private static boolean hasSucceeded(Transaction transaction) {
    if (transaction.isActive()) {
      transaction.rollback();
      return false; // failed
    } else {
      return true; // succeeded
    }
  }
}