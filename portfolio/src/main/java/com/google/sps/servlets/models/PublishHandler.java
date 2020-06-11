package com.google.sps.servlets.models;

import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFutureCallback;
import com.google.api.core.ApiFutures;
import com.google.api.gax.rpc.ApiException;
import com.google.cloud.pubsub.v1.Publisher;
import com.google.cloud.pubsub.v1.TopicAdminClient;
import com.google.common.util.concurrent.MoreExecutors;
import com.google.protobuf.ByteString;
import com.google.pubsub.v1.ProjectTopicName;
import com.google.pubsub.v1.PubsubMessage;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.io.IOException;
import java.lang.InterruptedException;

public class PublishHandler {
  private static final String PROJECT_ID = "scarletnguyen-step-2020";

  private String message;
  private ProjectTopicName topic;
  private Publisher publisher;

  public PublishHandler(String topicName) {
    this.topic = ProjectTopicName.of(PROJECT_ID, topicName);
    this.publisher = null;
    this.message = null;
  }

  public void publish(String message) {
    this.message = message;
    try {
      sendMessageToApi();
    } finally {
      if (publisher != null) terminatePublisher();
    }
  }

  private void sendMessageToApi() {
    try {
      this.publisher = Publisher.newBuilder(this.topic).build();

      ByteString data = ByteString.copyFromUtf8(this.message);
      PubsubMessage pubsubMessage = PubsubMessage.newBuilder().setData(data).build();

      // Once published, returns a server-assigned message id (unique within the topic)
      ApiFuture<String> future = publisher.publish(pubsubMessage);
      handleApiResponse(future);
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  private void terminatePublisher() {
    // When finished with the publisher, shutdown to free up resources.
    publisher.shutdown();
    try {
      publisher.awaitTermination(1, TimeUnit.MINUTES);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  }

  private void handleApiResponse(ApiFuture<String> future) {
    ApiFutures.addCallback(
      future,
      new ApiFutureCallback<String>() {

        @Override
        public void onFailure(Throwable throwable) {
          if (throwable instanceof ApiException) {
            ApiException apiException = ((ApiException) throwable);
            // details on the API exception
            System.out.println(apiException.getStatusCode().getCode());
            System.out.println(apiException.isRetryable());
          }
          System.out.println("Error publishing message : " + message);
        }

        @Override
        public void onSuccess(String messageId) {
          // Once published, returns server-assigned message ids (unique within the topic)
          System.out.println(messageId);
        }
      },
      MoreExecutors.directExecutor()
    );
  }
}