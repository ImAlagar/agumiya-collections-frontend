// src/components/debug/AuthDebug.jsx
import React from 'react';
import { USER_TYPES, STORAGE_KEYS } from '../../config/constants';
import { storageManager } from '../../services/storage/storageManager';

const AuthDebug = () => {
  const checkAuth = () => {
    const adminToken = storageManager.getItem(STORAGE_KEYS.AUTH_TOKEN, USER_TYPES.ADMIN);
    const userToken = storageManager.getItem(STORAGE_KEYS.AUTH_TOKEN, USER_TYPES.USER);
    const userData = storageManager.getItem(STORAGE_KEYS.USER_DATA, USER_TYPES.ADMIN) || 
                     storageManager.getItem(STORAGE_KEYS.USER_DATA, USER_TYPES.USER);

    return {
      adminToken: adminToken ? `Present (${adminToken.length} chars)` : 'Missing',
      userToken: userToken ? `Present (${userToken.length} chars)` : 'Missing',
      userData: userData ? 'Present' : 'Missing',
      isAuthenticated: !!(adminToken || userToken)
    };
  };

  const authStatus = checkAuth();

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 p-4 rounded-lg shadow-lg z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <pre className="text-xs">{JSON.stringify(authStatus, null, 2)}</pre>
      <button 
        onClick={() => window.location.reload()}
        className="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
      >
        Refresh
      </button>
    </div>
  );
};

export default AuthDebug;