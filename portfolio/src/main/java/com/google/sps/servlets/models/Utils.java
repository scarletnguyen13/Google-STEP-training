package com.google.sps.servlets.models;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Arrays;
import java.util.stream.Collectors;

public abstract class Utils {
  public static Map<String, String> extractFrom(String requestString, String[] params) {
    List<String> dataList = Arrays.asList(requestString.split("\\n+"));
    String initials = "Content-Disposition: form-data; ";

    Map<String, String> results = Arrays.asList(params)
      .stream()
      .distinct()
      .collect(Collectors.toMap(
        s -> s, 
        s -> dataList.get(dataList.indexOf(String.format("%sname=\"%s\"", initials, s)) + 1)
      ));

    return results;
  }
}