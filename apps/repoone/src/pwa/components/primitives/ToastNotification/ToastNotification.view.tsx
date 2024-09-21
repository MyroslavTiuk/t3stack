/* eslint-disable import/no-cycle */
import React from "react";
import Box from "../Box";
import Icon from "../Icon";
import T from "../Typo";
import css from "./ToastNotification.module.scss";
import {
  type Notification,
  NotificationTypes,
} from "./ToastNotificationProvider";

export default function ToastNotification({
  notifications = [],
  removeNotification,
}: {
  notifications: Notification[];
  removeNotification: (id: string) => void;
}) {
  return (
    <Box className={css.container}>
      {notifications?.map(({ message, type, id }: Notification, _: number) => (
        <Box
          className={css.itemContainer}
          key={id}
          onClick={() => removeNotification(id)}
          flex
        >
          <T
            content-pragmatic
            className={[
              css._message,
              type === NotificationTypes.Success && css["--success"],
              type === NotificationTypes.Error && css["--error"],
              type === NotificationTypes.Info && css["--info"],
            ]}
          >
            {message}
          </T>
          <Icon
            icon="close"
            ctnrClassName={css._closeIconContainer}
            className={css._closeIcon}
            small
          />
        </Box>
      ))}
    </Box>
  );
}
