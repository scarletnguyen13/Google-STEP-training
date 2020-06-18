package com.google.sps.models;

import java.util.List;
import java.util.ArrayList;
import org.junit.Assert;
import org.junit.Test;
import org.junit.Before;
import org.junit.After;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;
import com.google.sps.models.Comment.Status;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;

/**
 * Unit tests for the Course class.
 */
 @RunWith(JUnit4.class)
public final class CommentTest {
  private final LocalServiceTestHelper helper = 
    new LocalServiceTestHelper(new LocalDatastoreServiceTestConfig());

  private Comment comment;

  private long id = 1L;
  private long timestamp = System.currentTimeMillis();
  private String userId = "user1";
  private String username = "username1";
  private String content = "hello, this is a comment";
  private int likes = 1;
  private Status status = Status.PUBLIC;

  @Before
  public void setUp() {
    helper.setUp();
    comment = new Comment(
      id, timestamp, userId, username, content, likes, status
    );
  }

  @After
  public void tearDown() {
    helper.tearDown();
  }

  @Test
  public void testConstructor() {
    Assert.assertEquals(id, comment.getId());
    Assert.assertEquals(timestamp, comment.getTimestamp());
    Assert.assertEquals(userId, comment.getUserId());
    Assert.assertEquals(username, comment.getUsername());
    Assert.assertEquals(content, comment.getContent());
    Assert.assertEquals(likes, comment.getLikes());
    Assert.assertEquals(status.name(), comment.getStatus());
  }

  @Test
  public void testCreateEntityFromGivenParams() {
    Entity createdEntity = Comment.createCommentEntity(userId, username, content);

    Assert.assertEquals("Comment", createdEntity.getKind());
    Assert.assertTrue(createdEntity.hasProperty("timestamp"));
    Assert.assertEquals(userId, createdEntity.getProperty("userId"));
    Assert.assertEquals(username, createdEntity.getProperty("username"));
    Assert.assertEquals(content, createdEntity.getProperty("content"));
    Assert.assertEquals(0, createdEntity.getProperty("likes"));
    Assert.assertEquals(status.name(), createdEntity.getProperty("status"));
  }

  @Test
  public void testConvertCommentEntityToObject() {
    Entity entity = Comment.createCommentEntity(userId, username, content);
    Comment object = Comment.fromEntity(entity);

    Assert.assertEquals(entity.getKey().getId(), object.getId());
    Assert.assertEquals((long) entity.getProperty("timestamp"), object.getTimestamp());
    Assert.assertEquals(userId, object.getUserId());
    Assert.assertEquals(username, object.getUsername());
    Assert.assertEquals(content, object.getContent());
    Assert.assertEquals(((Number) entity.getProperty("likes")).intValue(), object.getLikes());
    Assert.assertEquals((String) entity.getProperty("status"), object.getStatus());
  }

  @Test
  public void convertCommentListToJson() {
    List<Comment> comments = new ArrayList<>();
    comments.add(comment);
    String output = Comment.convertToJson(comments);
    String result = "[" +
      "{\"id\":" + comment.getId() + "," +
      "\"timestamp\":" + comment.getTimestamp() +"," + 
      "\"userId\":\"" + comment.getUserId() + "\"," +
      "\"username\":\"" + comment.getUsername() + "\"," +
      "\"content\":\"" + comment.getContent() + "\"," +
      "\"likes\":" + comment.getLikes() + "," +
      "\"status\":\"" + comment.getStatus() + "\"}" + 
    "]";
    Assert.assertEquals(result, output);
  }
}