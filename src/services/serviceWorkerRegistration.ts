// Service Worker Registration & Lifecycle Management for EcoSort Ghana

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSyncTrigger?: () => void;
};

export function registerServiceWorker(config?: Config): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('[SW] Service workers are not supported by this browser.');
    return;
  }

  window.addEventListener('load', () => {
    const swUrl = '/sw.js';

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('[SW] ServiceWorker registered with scope:', registration.scope);

        // Check for updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) return;

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('[SW] New content is available and will be used when all tabs are closed.');
                if (config && config.onUpdate) {
                  config.onUpdate(registration);
                }
              } else {
                console.log('[SW] Content is cached for offline use.');
                if (config && config.onSuccess) {
                  config.onSuccess(registration);
                }
              }
            }
          };
        };

        // Register Background Sync if supported
        if ('sync' in registration) {
          try {
            (registration as any).sync.register('sync-waste-submissions').catch((err: any) => {
              console.warn('[SW] Background sync register failed:', err);
            });
          } catch {
            // ignore
          }
        }
      })
      .catch((error) => {
        console.warn('[SW] Error during service worker registration:', error);
      });

    // Listen for broadcast messages from ServiceWorker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'ECOSORT_BACKGROUND_SYNC_TRIGGER') {
        console.log('[SW] Background sync trigger received from ServiceWorker');
        if (config && config.onSyncTrigger) {
          config.onSyncTrigger();
        }
      }
    });
  });
}

export function unregisterServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

export async function requestBackgroundSync(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return false;
  try {
    const registration = await navigator.serviceWorker.ready;
    if ('sync' in registration) {
      await (registration as any).sync.register('sync-waste-submissions');
      return true;
    }
  } catch (e) {
    console.warn('[SW] Request background sync failed:', e);
  }
  return false;
}
