package com.google.sps.servlets.models;

import java.util.Date;

public class Comment {
  private long id;
  private Date createdAt;
  private String username;
  private String content;

  public Comment(String content) {
    Date currentDate = new Date();
    this.content = content;
    this.createdAt = currentDate;
    this.id = currentDate.getTime(); // to milliseconds
    this.username = RandomNameGenerator.generate();
  }
}