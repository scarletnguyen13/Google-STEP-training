package com.google.sps.servlets.models;

import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFutureCallback;
import com.google.api.core.ApiFutures;
import com.google.api.gax.rpc.ApiException;
import com.google.cloud.pubsub.v1.Publisher;
import com.google.common.util.concurrent.MoreExecutors;
import com.google.protobuf.ByteString;
import com.google.pubsub.v1.ProjectTopicName;
import com.google.pubsub.v1.PubsubMessage;

import java.io.IOException;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

public class PubSubUtils {
  private final static Logger LOGGER = Logger.getLogger(PubSubUtils.class.getName());

  private static final String PROJECT_ID = "scarletnguyen-step-2020";

  public static void publish(String topicName, String message) throws IOException {
    ProjectTopicName topic = ProjectTopicName.of(PROJECT_ID, topicName);
    Publisher publisher = Publisher.newBuilder(topic).build();
    ByteString data = ByteString.copyFromUtf8(message);
    PubsubMessage pubsubMessage = PubsubMessage.newBuilder().setData(data).build();

    // Once published, returns a server-assigned message id (unique within the topic)
    ApiFuture<String> future = publisher.publish(pubsubMessage);
    handleApiResponse(future);

    if (publisher != null) {
      terminate(publisher);
    }
  }

  private static void terminate(Publisher publisher) {
    // When finished with the publisher, shutdown to free up resources.
    publisher.shutdown();
    try {
      // Wait for all work has completed execution after a shutdown() request, 
      // or the timeout occurs, or the current thread is interrupted.
      publisher.awaitTermination(10, TimeUnit.SECONDS);
    } catch (InterruptedException e) {
      LOGGER.log(Level.SEVERE, e.toString(), e);
    }
  }

  private static void handleApiResponse(ApiFuture<String> future) {
    ApiFutures.addCallback(
      future,
      new ApiFutureCallback<String>() {

        @Override
        public void onFailure(Throwable throwable) {
          if (throwable instanceof ApiException) {
            ApiException apiException = ((ApiException) throwable);
            // details on the API exception
            LOGGER.log(Level.SEVERE, apiException.toString(), apiException);
          }
        }

        @Override
        public void onSuccess(String messageId) {
          // Once published, returns server-assigned message ids (unique within the topic)
          LOGGER.log(Level.FINE, "Success - MessageId: {0}", messageId);
        }
      },
      MoreExecutors.directExecutor()
    );
  }
}