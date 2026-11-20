const DEFAULT_ICON = '/notification-icon.png';
export const ONESIGNAL_APP_ID = '3200bb24-74f1-49d7-b621-42026ca275b0';

let oneSignalInitPromise = null;

export function initOneSignal() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (oneSignalInitPromise) return oneSignalInitPromise;

  oneSignalInitPromise = new Promise((resolve) => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];

    window.OneSignalDeferred.push(async function (OneSignal) {
      try {
        await OneSignal.init({
          appId: ONESIGNAL_APP_ID,
          allowLocalhostAsSecureOrigin: true
        });
        resolve(OneSignal);
      } catch {
        resolve(null);
      }
    });

    const scriptId = 'onesignal-sdk-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
      script.defer = true;
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    }
  });

  return oneSignalInitPromise;
}

export function playNotificationTone() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // نغمة أوضح وأطول شوية (حوالي 0.75 ثانية)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(784, now); // G5
    osc.frequency.setValueAtTime(1046.5, now + 0.22); // C6
    osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.55); // D6

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.45, now + 0.04);
    gain.gain.setValueAtTime(0.4, now + 0.45);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.76);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.78);

    osc.onended = () => {
      ctx.close().catch(() => {});
    };
  } catch {
    // Ignore audio errors if blocked before user interaction
  }
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';

  try {
    return await Notification.requestPermission();
  } catch {
    return 'default';
  }
}

export async function triggerAlertNotification({
  title,
  body,
  icon = DEFAULT_ICON,
  tag = 'chat-alert',
  onClickUrl = '/'
}) {
  playNotificationTone();

  if (!('Notification' in window)) return;

  const permission =
    Notification.permission === 'granted'
      ? 'granted'
      : await requestNotificationPermission();

  if (permission !== 'granted') return;

  const options = {
    body: String(body || ''),
    icon,
    badge: icon,
    tag,
    renotify: true,
    silent: true
  };

  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.showNotification) {
        await registration.showNotification(title, {
          ...options,
          data: { url: onClickUrl }
        });
        return;
      }
    }

    const notif = new Notification(title, options);
    notif.onclick = () => {
      window.focus();
      if (onClickUrl && window.location.pathname !== onClickUrl) {
        window.location.href = onClickUrl;
      }
      notif.close();
    };
  } catch {
    // Fallback ignored
  }
}