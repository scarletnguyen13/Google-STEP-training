package com.google.sps.servlets.models;

import com.google.appengine.api.datastore.Entity;
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
import java.util.logging.Logger;
import java.util.logging.Level;

public class RequestData {
  private final static Logger LOGGER = Logger.getLogger(RequestData.class.getName());

  private final Map<String, String> data;

  public RequestData(HttpServletRequest request) throws IOException {
    Map<String, String> validatedData = new HashMap<>();
    try {
      validatedData = this.validateMultipart(request);
    } catch (ServletException e) {
      LOGGER.log(Level.SEVERE, e.toString(), e);
    } catch (InvalidMultipartRequest e) {
      LOGGER.log(Level.SEVERE, e.toString(), e);
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
        String.format("%s does not exist in the map or its value is null", key)
      );
    }
  }

  private Map<String, String> validateMultipart(HttpServletRequest request) 
    throws IOException, ServletException, InvalidMultipartRequest{
    String contentType = request.getContentType();

    if (contentType != null && contentType.startsWith("multipart/")) {
      return this.convertPartsToMap(request.getParts());
    } else {  
      throw new InvalidMultipartRequest(String.format("Invalid content type: %s", contentType));
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
      LOGGER.log(Level.SEVERE, e.toString(), e);
    } finally {
      return result;
    }
  }
}