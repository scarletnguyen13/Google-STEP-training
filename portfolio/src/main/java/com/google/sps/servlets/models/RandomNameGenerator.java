package com.google.sps.servlets.models;

import java.util.List;
import java.util.Arrays;
import java.util.Collections;

public class RandomNameGenerator {
  private static final List<String> ADJECTIVES = 
    Collections.unmodifiableList(Arrays.asList(
      "autumn", "hidden", "bitter", "misty", "silent", "empty", "dry",
      "dark", "summer", "icy", "delicate", "quiet", "white", "cool", "spring",
      "winter", "patient", "twilight", "dawn", "crimson", "wispy", "weathered",
      "blue", "billowing", "broken", "cold", "damp", "falling", "frosty", "green",
      "long", "late", "lingering", "bold", "little", "morning", "muddy", "old",
      "red", "rough", "still", "small", "sparkling", "throbbing", "shy",
      "wandering", "withered", "wild", "black", "young", "holy", "solitary",
      "fragrant", "aged", "snowy", "proud", "floral", "restless", "divine",
      "polished", "ancient", "purple", "lively", "nameless"
    ));

  private static final List<String> NOUNS = 
    Collections.unmodifiableList(Arrays.asList(
      "waterfall", "river", "breeze", "moon", "rain", "wind", "sea",
      "morning", "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn",
      "glitter", "forest", "hill", "cloud", "meadow", "sun", "glade", "bird",
      "brook", "butterfly", "bush", "dew", "dust", "field", "fire", "flower",
      "firefly", "feather", "grass", "haze", "mountain", "night", "pond",
      "darkness", "snowflake", "silence", "sound", "sky", "shape", "surf",
      "thunder", "violet", "water", "wildflower", "wave", "water", "resonance",
      "sun", "wood", "dream", "cherry", "tree", "fog", "frost", "voice", "paper",
      "frog", "smoke", "star"
    ));

  // Static Factory method
  public static String generate() {
    String randomAdjective = ADJECTIVES.get(generateRandomIndex(ADJECTIVES.size()));
    String randomNoun = NOUNS.get(generateRandomIndex(NOUNS.size()));
    return capitalize(randomAdjective) + " " + capitalize(randomNoun);
  }
  
  private static int generateRandomIndex(int listLength) {
    return (int) Math.floor(Math.random() * listLength);
  }

  private static String capitalize(String str) {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
  }
}