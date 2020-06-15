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

public class PubSubHandler {
  private static final String PROJECT_ID = "scarletnguyen-step-2020";
  private static final String LOG_CONTEXT = "(JAVA SERVER) PUBSUB HANDLER LOG: ";

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
      e.printStackTrace();
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
            System.out.println(LOG_CONTEXT + "Failure;");
            System.out.println(LOG_CONTEXT + apiException.getStatusCode().getCode());
            System.out.println(LOG_CONTEXT + apiException.isRetryable());
          }
        }

        @Override
        public void onSuccess(String messageId) {
          // Once published, returns server-assigned message ids (unique within the topic)
          System.out.println(LOG_CONTEXT + "Success;");
          System.out.println(LOG_CONTEXT + "Message ID - " + messageId);
        }
      },
      MoreExecutors.directExecutor()
    );
  }
}