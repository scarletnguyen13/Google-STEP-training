package com.google.sps.servlets.exceptions;

import java.lang.Exception;

public class InvalidMultipartRequest extends Exception { 
  public InvalidMultipartRequest(String errorMessage) {
    super(errorMessage);
  }
}