import { lsGet, lsSet, lsRemove } from './storage';

const KEYS = {
  status: 'userStatus',
  userID: 'userID',
  userName: 'userName',
  userEmail: 'userEmail',
};

export function getUserStatus() {
  const v = lsGet(KEYS.status);
  return v === 'active' || v === 'inactive' || v === 'unauthorized'
    ? v
    : null;
}

export function setUserStatus(status) {
  lsSet(KEYS.status, status);
}

export function clearUserSession() {
  Object.values(KEYS).forEach(lsRemove);
}
