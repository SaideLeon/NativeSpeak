/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState } from 'react';
import { useNotificationStore, Notification } from '../lib/notificationStore';
import cn from 'classnames';
import './NotificationToast.css';

const NOTIFICATION_DURATION = 4500;
const ANIMATION_DURATION = 500;

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const { removeNotification } = useNotificationStore();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        removeNotification(notification.id);
      }, ANIMATION_DURATION);
    }, NOTIFICATION_DURATION);

    return () => {
      clearTimeout(exitTimer);
    };
  }, [notification.id, removeNotification]);

  return (
    <div className={cn('notification-toast', `notification-type-${notification.type}`, { visible: !isExiting })}>
      {notification.icon && <span className="notification-toast-icon icon">{notification.icon}</span>}
      <div className="notification-toast-content">
        {notification.title && <span className="notification-toast-title">{notification.title}</span>}
        <span className="notification-toast-message">{notification.message}</span>
      </div>
    </div>
  );
};

const NotificationToast: React.FC = () => {
  const { notifications } = useNotificationStore();

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationToast;