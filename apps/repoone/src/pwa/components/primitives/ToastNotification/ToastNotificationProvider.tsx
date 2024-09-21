/* eslint-disable import/no-cycle */
import * as R from "ramda";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import ToastNotification from "./ToastNotification.view";

export enum NotificationTypes {
  Error = "Error",
  Success = "Success",
  Info = "Info",
}

export interface AddNotificationParams {
  message: string;
  type: NotificationTypes;
}

export interface Notification extends AddNotificationParams {
  id: string;
}

export interface ToasterNotificationContextValues {
  addNotification: (message: string, type: NotificationTypes) => void;
  addSuccessNotification: (message: string) => void;
  addErrorNotification: (message: string) => void;
}

// Note: keep in sync with scss variable in ToastNotification.module.scss
const DISPLAY_DURATION = 2000;

export const ToastNotificationContext =
  createContext<ToasterNotificationContextValues>({
    addNotification: () => null,
    addErrorNotification: () => null,
    addSuccessNotification: () => null,
  });

export default function ToastNotificationProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notificationsRef = useRef(notifications);
  React.useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  const removeNotification = useCallback(
    (id: string) => {
      const notifAfterRemoval = notificationsRef?.current?.filter(
        (item: { id: string }) => item.id !== id
      );

      setNotifications(notifAfterRemoval);
    },
    [notificationsRef, notifications]
  );

  const addTransient = (id: string): void => {
    window.setTimeout(() => removeNotification(id), DISPLAY_DURATION);
  };

  const addNotification = (
    message: string,
    type: NotificationTypes = NotificationTypes.Info
  ) => {
    const id = uuidv4();

    const newNotifs = R.prepend(
      {
        id,
        message,
        type,
      },
      notifications
    );
    setNotifications(newNotifs);

    addTransient(id);
  };

  const addErrorNotification = (message: string) => {
    addNotification(message, NotificationTypes.Error);
  };

  const addSuccessNotification = (message: string) => {
    addNotification(message, NotificationTypes.Success);
  };

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <ToastNotificationContext.Provider
      value={{
        addNotification,
        addErrorNotification,
        addSuccessNotification,
      }}
    >
      {isLoaded && (
        <ToastNotification
          notifications={notifications}
          removeNotification={removeNotification}
        />
      )}
      {children}
    </ToastNotificationContext.Provider>
  );
}

export const useToastNotification = (): ToasterNotificationContextValues =>
  useContext(ToastNotificationContext);
