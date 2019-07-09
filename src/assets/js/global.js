//sessionId 可以 全局

import Storage from './storage';

const getSessionId = () => {
  return Storage.getSession("sessionId");
};

const setSessionId = session => {
  Storage.setSession("sessionId", session);
};

export default {
  getSessionId,
  setSessionId,
}
