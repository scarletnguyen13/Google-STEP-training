package com.google.sps.servlets;

import com.google.sps.models.RequestDataTest;
import org.junit.Assert;
import org.junit.Test;
import org.junit.Before;
import org.junit.After;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;
import org.mockito.MockitoAnnotations;
import org.mockito.Mockito;

import com.google.sps.models.Comment;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.List;
import java.util.ArrayList;
import java.util.Collection;
import javax.servlet.http.Part;
import com.google.gson.Gson;
import java.io.FileReader;

import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.firebase.auth.FirebaseAuthException;

import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Query;

/**
 * Unit tests for the Course class.
 */
 @RunWith(JUnit4.class)
public final class CommentServletTest {
  private final LocalServiceTestHelper helper = 
    new LocalServiceTestHelper(new LocalDatastoreServiceTestConfig());

  private static final CommentServlet commentServlet = new CommentServlet();
  private HttpServletRequest mockRequest;
  private HttpServletResponse mockResponse;
  private String tokenId;

  @Before
  public void setUp() throws IOException, ServletException {
    tokenId = getTokenId();
    mockRequest = Mockito.mock(HttpServletRequest.class);
    mockResponse = Mockito.mock(HttpServletResponse.class);
    helper.setUp();
    MockitoAnnotations.initMocks(this);
  }

  @After
  public void tearDown() {
    helper.tearDown();
  }

  @Test
  public void testGet() throws IOException {
    String data = Comment.convertToJson(generateRandomComments());
    StringWriter stringWriter = new StringWriter();
    stringWriter.write(data);
    PrintWriter writer = new PrintWriter(stringWriter);
    Mockito.when(mockResponse.getWriter()).thenReturn(writer);

    commentServlet.doGet(mockRequest, mockResponse);
    Assert.assertTrue(stringWriter.toString().contains(data));
  }

  private List<Comment> generateRandomComments() {
    List<Comment> comments = new ArrayList<>();
    for (int i = 1; i <= 5; i++) {
      comments.add(new Comment(
        Long.valueOf(i), 
        System.currentTimeMillis(), 
        "user" + i, 
        "username" + i, 
        "hello, this is a comment #" + i, 
        0, 
        Comment.Status.PUBLIC
      ));
    }
    return comments;
  }

  @Test
  public void testPost() throws IOException, ServletException {
    testGet();
    Mockito.when(mockRequest.getContentType()).thenReturn("multipart/");
    Mockito.when(mockRequest.getParameter("id")).thenReturn(tokenId);

    Collection<Part> parts = RequestDataTest.mockRequestParts();
    Mockito.when(mockRequest.getParts()).thenReturn(parts);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Assert.assertEquals(0, datastore.prepare(new Query("Comment")).countEntities());
    
    commentServlet.doPost(mockRequest, mockResponse);

    Assert.assertEquals(1, datastore.prepare(new Query("Comment")).countEntities());
  }

  @Test
  public void testDelete() throws IOException, ServletException {
    testGet();
    testPost();
    Mockito.when(mockRequest.getParameter("id")).thenReturn(tokenId);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Filter deletedOnlyFilter = new FilterPredicate(
      "status", FilterOperator.EQUAL, Comment.Status.DELETED.name()
    );
    Query query = new Query("Comment").setFilter(deletedOnlyFilter);

    Assert.assertEquals(0, datastore.prepare(query).countEntities());
    
    commentServlet.doDelete(mockRequest, mockResponse);

    Assert.assertEquals(1, datastore.prepare(query).countEntities());
  }

  private String getTokenId() throws IOException {
    Gson gson = new Gson();
    String filePath = "/home/scarletnguyen/step/portfolio/src/test/java/com/google/sps/servlets/Token.json";
    String tokenId = gson.fromJson(new FileReader(filePath), String.class);
    return tokenId;
  }
}
