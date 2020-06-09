package com.google.sps.servlets.models;

import com.google.appengine.api.datastore.Entity;
import java.util.List;
import java.util.Arrays;
import com.google.gson.Gson;
import java.util.Map;
import java.util.HashMap;
import java.util.Collection;
import java.util.stream.Collectors;

import com.google.sps.servlets.exceptions.InvalidMultipartRequest;
import javax.servlet.ServletException;
import javax.servlet.http.Part;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import org.apache.commons.io.IOUtils;
import java.io.InputStream;
import java.util.NoSuchElementException;

public class RequestData {
  private final Map<String, String> data;

  public RequestData(HttpServletRequest request) throws IOException {
    Map<String, String> validatedData = new HashMap<>();
    try {
      validatedData = this.validateMultipart(request);
    } catch (ServletException e) {
      e.printStackTrace();
    } catch (InvalidMultipartRequest e) {
      e.printStackTrace();
    } finally {
      this.data = validatedData;
    }
  }

  public String get(String key) {
    String value = this.data.get(key);
    if (value != null) {
      return value;
    } else {
      throw new NoSuchElementException(
        key + " does not exist in the map or its value is null"
      );
    }
  }

  private Map<String, String> validateMultipart(HttpServletRequest request) 
    throws IOException, ServletException, InvalidMultipartRequest{
    String contentType = request.getContentType();

    if (contentType != null && contentType.startsWith("multipart/")) {
      return this.convertPartsToMap(request.getParts());
    } else {  
      throw new InvalidMultipartRequest("Invalid content type: " + contentType);
    } 
  }

  private Map<String, String> convertPartsToMap(Collection<Part> parts) {
    return parts.stream().collect(Collectors.toMap(
      Part::getName, 
      part -> getStringFromInputStream(part)
    ));
  }

  private String getStringFromInputStream(Part part) {
    String result = null;
    try {
      result = IOUtils.toString(part.getInputStream());
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      return result;
    }
  }
}