package com.google.sps.models;

import org.junit.Assert;
import org.junit.Test;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;
import org.mockito.MockitoAnnotations;
import org.mockito.Mockito;
import javax.servlet.http.HttpServletRequest;
import java.util.NoSuchElementException;
import java.io.IOException;
import com.google.sps.exceptions.InvalidMultipartRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Collection;
import java.util.List;
import java.util.Arrays;
import javax.servlet.http.Part;
import org.apache.commons.io.IOUtils;
import javax.servlet.ServletException;
import com.google.sps.exceptions.InvalidMultipartRequest;

/**
 * Unit tests for the Course class.
 */
 @RunWith(JUnit4.class)
public final class RequestDataTest {
  private RequestData requestData;

  private static final String param1 = "username";
  private static final String body1 = "user1";
  private static final String param2 = "content";
  private static final String body2 = "hello, this is a comment!";

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    testConstructor();
  }

  @Test
  public void testConstructor() {
    Map<String, String> resultData = new HashMap<>();
    resultData.put(param1, body1);
    resultData.put(param2, body2);

    HttpServletRequest mockedRequest = Mockito.mock(HttpServletRequest.class);
    Mockito.when(mockedRequest.getContentType()).thenReturn("multipart/");
    try {
      Collection<Part> parts = mockRequestParts();
      Mockito.when(mockedRequest.getParts()).thenReturn(parts);
      requestData = new RequestData(mockedRequest);
      Assert.assertEquals(resultData, requestData.getData());
    } catch (IOException e) {
      Assert.fail("IOException was thrown");
    } catch (ServletException e) {
      Assert.fail("ServletException was thrown");
    } catch (InvalidMultipartRequest e) {
      Assert.fail("InvalidMultipartRequest was thrown");
    }
  }

  public static Collection<Part> mockRequestParts() throws IOException {
    Part usernamePart = Mockito.mock(Part.class);
    Part contentPart = Mockito.mock(Part.class);

    Mockito.when(usernamePart.getName()).thenReturn(param1);
    Mockito.when(usernamePart.getInputStream())
    .thenReturn(IOUtils.toInputStream(body1, "UTF-8"));

    Mockito.when(contentPart.getName()).thenReturn(param2);
    Mockito.when(contentPart.getInputStream())
    .thenReturn(IOUtils.toInputStream(body2, "UTF-8"));

    Collection<Part> parts = Arrays.asList(usernamePart, contentPart);
    return parts;
  }

  @Test(expected = NoSuchElementException.class)
  public void testGetNoSuchElement() {
    requestData.get("hello");
  }

  @Test
  public void testGetParam() {
    Assert.assertEquals(body1, requestData.get(param1));
    Assert.assertEquals(body2, requestData.get(param2));
  }

  @Test
  public void testNullRequestContentType() {
    HttpServletRequest mockedRequest = Mockito.mock(HttpServletRequest.class);
    Mockito.when(mockedRequest.getContentType()).thenReturn(null);
    try {
      requestData = new RequestData(mockedRequest);
    } catch (IOException e) {
      Assert.fail("IOException was thrown");
    } catch (ServletException e) {
      Assert.fail("ServletException was thrown");
    } catch (InvalidMultipartRequest e) {
      // Success!
      Assert.assertEquals("Invalid content type: null", e.getMessage());
    }
  }

  @Test
  public void testWrongRequestContentType() {
    HttpServletRequest mockedRequest = Mockito.mock(HttpServletRequest.class);
    Mockito.when(mockedRequest.getContentType()).thenReturn("text/");
    try {
      requestData = new RequestData(mockedRequest);
    } catch (IOException e) {
      Assert.fail("IOException was thrown");
    } catch (ServletException e) {
      Assert.fail("ServletException was thrown");
    } catch (InvalidMultipartRequest e) {
      // Success!
      Assert.assertEquals("Invalid content type: text/", e.getMessage());
    }
  }
}