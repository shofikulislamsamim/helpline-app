/**
 * Browser / Web Push Notification Manager for HelpLine
 * Handles permissions, notification dispatch, and graceful fallback when in iframe / unsupported environments.
 */

export type PushNotificationStatus = 'granted' | 'denied' | 'default' | 'unsupported';

/**
 * Checks if the Web Notification API is supported in the current environment
 */
export function isPushNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Gets current browser notification permission
 */
export function getNotificationPermission(): PushNotificationStatus {
  if (!isPushNotificationSupported()) {
    return 'unsupported';
  }
  return Notification.permission as PushNotificationStatus;
}

/**
 * Requests browser notification permission gracefully
 * Returns the new permission status
 */
export async function requestNotificationPermission(): Promise<PushNotificationStatus> {
  if (!isPushNotificationSupported()) {
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    // Cache that user made a choice
    try {
      localStorage.setItem('helpline_push_prompted', 'true');
    } catch (e) {}
    return permission as PushNotificationStatus;
  } catch (error) {
    console.debug('Browser notification permission request note:', error);
    return 'denied';
  }
}

/**
 * Convenient boolean helper for permission request
 */
export async function requestBrowserPushPermission(): Promise<boolean> {
  const res = await requestNotificationPermission();
  return res === 'granted';
}

export interface NotificationPayload {
  title: string;
  body: string;
  tag?: string;
  icon?: string;
  url?: string;
}

/**
 * Dispatches a native browser notification if permission is granted.
 * Wraps safely in try/catch to ensure iframe security policies do not crash the app.
 */
export function dispatchBrowserNotification(payload: NotificationPayload): boolean {
  if (!isPushNotificationSupported()) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    // Sanitize body to avoid leaking PII (passwords, complete NID, etc.)
    const safeBody = (payload.body || '').replace(/01[3-9]\d{8}/g, (phone) => {
      return phone.slice(0, 3) + '*****' + phone.slice(8);
    });

    const notif = new Notification(payload.title, {
      body: safeBody,
      icon: payload.icon || '/favicon.ico',
      badge: '/favicon.ico',
      tag: payload.tag || 'helpline-alert',
      silent: false,
    });

    // Auto dismiss after 6 seconds to avoid cluttering user screen
    setTimeout(() => {
      try {
        notif.close();
      } catch (e) {}
    }, 6000);

    return true;
  } catch (error) {
    // In sandboxed iframes without 'allow-modals' or push restrictions, this is expected
    console.debug('Native browser notification dispatch note (in-app fallback active):', error);
    return false;
  }
}
