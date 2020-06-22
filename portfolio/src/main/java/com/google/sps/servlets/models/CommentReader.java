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

public class CommentReader {
  private Logger logger = Logger.getLogger(CommentReader.class.getName());
  private DatastoreService datastore;

  public CommentReader() {
    datastore = DatastoreServiceFactory.getDatastoreService();
  }

  public List<Comment> getAll() {
    Query.Filter publicOnlyFilter = new Query.FilterPredicate(
            "status", Query.FilterOperator.EQUAL, Comment.Status.PUBLIC.name()
    );
    Query query = new Query("Comment")
            .setFilter(publicOnlyFilter)
            .addSort("timestamp", Query.SortDirection.DESCENDING);

    PreparedQuery results = datastore.prepare(query);

    List<Comment> comments = new ArrayList<>();
    for (Entity entity : results.asIterable()) {
      Comment comment = Comment.fromEntity(entity);
      comments.add(comment);
    }
    return comments;
  }

  public String insertOne(String userId, RequestData requestData) throws NoSuchElementException {
    Transaction transaction = datastore.beginTransaction();
    Entity commentEntity = Comment.createCommentEntity(
            userId, requestData.get("username"), requestData.get("content")
    );
    datastore.put(transaction, commentEntity);
    transaction.commit();
    if (transaction.isActive()) {
      transaction.rollback();
    }
    return Comment.convertToJson(commentEntity);
  }

  public String deleteAll(String userId) throws Exception {
    Transaction transaction = datastore.beginTransaction(TransactionOptions.Builder.withXG(true));
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
    datastore.put(transaction, updatedComments);
    transaction.commit();
    if (transaction.isActive()) {
      transaction.rollback();
    }
    return String.format("{ \"message\":  \"deleted\", \"userId\": \"%s\" }", userId);
  }
}
