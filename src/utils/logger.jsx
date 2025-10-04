// src/utils/logger.js
const ENV = import.meta.env.MODE || process.env.NODE_ENV || "development";
const isDev = ENV === "development";
const LOG_ENDPOINT = import.meta.env.VITE_LOGGING_API_URL || "";

async function sendToServer(level, message, details) {
  try {
    if (!LOG_ENDPOINT) return;
    await fetch(LOG_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        level,
        message,
        details,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      }),
    });
  } catch (err) {
    // ignore network errors silently
  }
}

const logger = {
  info: (msg, ...args) => isDev && console.info(`ℹ️ [INFO]: ${msg}`, ...args),
  warn: (msg, ...args) => isDev && console.warn(`⚠️ [WARN]: ${msg}`, ...args),
  debug: (msg, ...args) => isDev && console.debug(`🐞 [DEBUG]: ${msg}`, ...args),
  error: (msg, ...args) => {
    if (isDev) console.error(`❌ [ERROR]: ${msg}`, ...args);
    if (!isDev) sendToServer("error", msg, args);
  },
};

export default logger;
