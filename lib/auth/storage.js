export function isBrowser() {
    return typeof window !== 'undefined';
  }
  
  export function lsGet(key) {
    if (!isBrowser()) return null;
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }
  
  export function lsSet(key, value) {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      // ignore
    }
  }
  
  export function lsRemove(key) {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      // ignore
    }
  }
  