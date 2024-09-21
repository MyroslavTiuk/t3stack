import React from "react";

import Button from "../Button";
import StoryView from "../Story";
import ToastNotificationProvider, {
  NotificationTypes,
  useToastNotification,
} from "./ToastNotificationProvider";

const ToastNotificationStories = () => {
  const { addNotification, addErrorNotification, addSuccessNotification } =
    useToastNotification();
  return (
    <div className={"theme--light grid"}>
      <StoryView title={"Default"} className={"_4"}>
        <Button
          onClick={() =>
            addNotification(
              "This is a sample Info Toast Notification",
              NotificationTypes.Info
            )
          }
        >
          Show Info
        </Button>
      </StoryView>
      <StoryView title={"Success Toast Notification"} className={"_4"}>
        <Button
          onClick={() =>
            addSuccessNotification(
              "This is a sample Success Toast Notification"
            )
          }
        >
          Show Success
        </Button>
      </StoryView>
      <StoryView title={"Error Toast Notification"} className={"_4"}>
        <Button
          onClick={() =>
            addErrorNotification("This is a sample Error Toast Notification")
          }
        >
          Show Error
        </Button>
      </StoryView>
    </div>
  );
};

export default function ModalStory() {
  return (
    <ToastNotificationProvider>
      <ToastNotificationStories />
    </ToastNotificationProvider>
  );
}
