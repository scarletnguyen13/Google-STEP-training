package com.google.sps.servlets.exceptions;

public class InvalidMultipartRequest extends Exception {
  public InvalidMultipartRequest(String errorMessage) {
    super(errorMessage);
  }
}