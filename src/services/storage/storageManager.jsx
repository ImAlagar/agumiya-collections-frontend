// src/services/storage/storageManager.js
import { USER_TYPES, STORAGE_KEYS } from '../../config/constants.jsx';

class StorageManager {
  constructor() {
    this.userStorage = localStorage;
    this.adminStorage = localStorage;
  }

  // Create unique key per user type
  getStorageKey(key, userType) {
    return `${userType}_${key}`; // Example: "admin_authToken", "user_authToken"
  }

  getStorage(userType) {
    return userType === USER_TYPES.ADMIN ? this.adminStorage : this.userStorage;
  }

  setItem(key, value, userType = USER_TYPES.USER) {
    try {
      const storage = this.getStorage(userType);
      storage.setItem(this.getStorageKey(key, userType), JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage setItem error:', error);
      return false;
    }
  }

  getItem(key, userType = USER_TYPES.USER) {
    try {
      const storage = this.getStorage(userType);
      const item = storage.getItem(this.getStorageKey(key, userType));
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  }

  removeItem(key, userType = USER_TYPES.USER) {
    try {
      const storage = this.getStorage(userType);
      storage.removeItem(this.getStorageKey(key, userType));
      return true;
    } catch (error) {
      console.error('Storage removeItem error:', error);
      return false;
    }
  }

  clear(userType = USER_TYPES.USER) {
    try {
      const storage = this.getStorage(userType);
      Object.values(STORAGE_KEYS).forEach(key => {
        storage.removeItem(this.getStorageKey(key, userType));
      });
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }

  clearAllAuth() {
    try {
      this.clear(USER_TYPES.USER);
      this.clear(USER_TYPES.ADMIN);
      return true;
    } catch (error) {
      console.error('clearAllAuth error:', error);
      return false;
    }
  }

  getCurrentUserType() {
    const adminUserType = this.getItem(STORAGE_KEYS.USER_TYPE, USER_TYPES.ADMIN);
    const userUserType = this.getItem(STORAGE_KEYS.USER_TYPE, USER_TYPES.USER);

    if (adminUserType === USER_TYPES.ADMIN) return USER_TYPES.ADMIN;
    if (userUserType === USER_TYPES.USER) return USER_TYPES.USER;

    const adminToken = this.getItem(STORAGE_KEYS.AUTH_TOKEN, USER_TYPES.ADMIN);
    const userToken = this.getItem(STORAGE_KEYS.AUTH_TOKEN, USER_TYPES.USER);

    if (adminToken) return USER_TYPES.ADMIN;
    if (userToken) return USER_TYPES.USER;

    return null;
  }
}

export const storageManager = new StorageManager();

// Helpers
export const getStorageItem = (key, userType) => storageManager.getItem(key, userType);
export const setStorageItem = (key, value, userType) => storageManager.setItem(key, value, userType);
export const removeStorageItem = (key, userType) => storageManager.removeItem(key, userType);
export const clearAllAuth = () => storageManager.clearAllAuth();
