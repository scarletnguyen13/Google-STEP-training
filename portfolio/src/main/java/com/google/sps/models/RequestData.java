package com.google.sps.models;

import com.google.appengine.api.datastore.Entity;
import java.util.Map;
import java.util.HashMap;
import java.util.Collection;
import com.google.sps.exceptions.InvalidMultipartRequest;
import javax.servlet.ServletException;
import javax.servlet.http.Part;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import org.apache.commons.io.IOUtils;
import java.io.InputStream;
import java.util.NoSuchElementException;

public class RequestData {
  private final Map<String, String> data;

  public RequestData(HttpServletRequest request) 
    throws IOException, ServletException, InvalidMultipartRequest {
    Map<String, String> validatedData = new HashMap<>();
    validatedData = this.validateMultipart(request);
    this.data = validatedData;
  }

  public Map<String, String> getData() {
    return this.data;
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

  private Map<String, String> convertPartsToMap(Collection<Part> parts) throws IOException {
    Map<String, String> result = new HashMap();
    for (Part part : parts) {
      result.put(part.getName(), IOUtils.toString(part.getInputStream()));
    }
    return result;
  }
}