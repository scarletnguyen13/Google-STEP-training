package com.google.sps.servlets.models;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Transaction;
import com.google.appengine.api.datastore.TransactionOptions;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

public abstract class CommentReader {
  private final static Logger LOGGER = Logger.getLogger(CommentReader.class.getName());

  public static List<Comment> getAll() {
    Query.Filter publicOnlyFilter = new Query.FilterPredicate(
            "status", Query.FilterOperator.EQUAL, Comment.Status.PUBLIC.name()
    );
    Query query = new Query("Comment")
            .setFilter(publicOnlyFilter)
            .addSort("timestamp", Query.SortDirection.DESCENDING);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    List<Comment> comments = new ArrayList<>();
    for (Entity entity : results.asIterable()) {
      Comment comment = Comment.fromEntity(entity);
      comments.add(comment);
    }
    return comments;
  }

  public static String insertOne(String userId, RequestData requestData) {
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Transaction transaction = datastore.beginTransaction();
    String successResponse = "";
    String failureResponse = "Failed to post comment. Please try again";
    try {
      Entity commentEntity = Comment.createCommentEntity(
              userId, requestData.get("username"), requestData.get("content")
      );
      datastore.put(transaction, commentEntity);
      transaction.commit();
      successResponse = Comment.convertToJson(commentEntity);
    } catch (NoSuchElementException e) {
      successResponse = failureResponse;
      LOGGER.log(Level.SEVERE, e.toString(), e);
    } finally {
      return (hasSucceeded(transaction) ? successResponse : failureResponse);
    }
  }

  public static String deleteAll(String userId) {
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Transaction transaction = datastore.beginTransaction(TransactionOptions.Builder.withXG(true));

    String successResponse = String.format("{ \"message\":  \"deleted\", \"userId\": \"%s\" }", userId);
    String failureResponse = "Failed to delete comments. Please try again";

    Query.Filter matchedUserIdFilter = new Query.FilterPredicate("userId", Query.FilterOperator.EQUAL, userId);
    Query query = new Query("Comment").setFilter(matchedUserIdFilter);
    PreparedQuery results = datastore.prepare(query);

    FetchOptions fetchOptions = FetchOptions.Builder.withDefaults();
    List<Entity> updatedComments = results.asList(fetchOptions).stream()
      .map(entity -> {
        entity.setProperty("status", Comment.Status.DELETED.name());
        return entity;
      })
      .collect(Collectors.toList());

    try {
      // Batch update
      datastore.put(transaction, updatedComments);
      transaction.commit();
    } catch (Exception e) {
      successResponse = failureResponse;
      LOGGER.log(Level.SEVERE, e.toString(), e);
    } finally {
      return (hasSucceeded(transaction) ? successResponse : failureResponse);
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
