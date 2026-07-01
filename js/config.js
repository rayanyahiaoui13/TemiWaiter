// js/config.js
export const MQTT_CONFIG = {
  broker: "0cb6b7de17494a0b8d1fbb40718195cd.s1.eu.hivemq.cloud",
  port: 8884,
  clientId: "DashboardWebRTC_" + Math.random().toString(16).substr(2, 8),

  username: "temi_admin",
  password: "TestTemi1",
};

export const RTC_CONFIG = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const MENU_PRICES = {
  "Caesar Salad": 8.5,
  "Garlic Bread": 5.0,
  "Temi Burger": 15.0,
  "Grilled Salmon": 18.0,
  "Choco Fondant": 6.5,
  Cheesecake: 7.0,
  "Coca-Cola": 3.5,
  "Water Bottle": 2.0,
};

// Topics are now built dynamically per Robot ID (serial number),
// matching the Kotlin side which subscribes/publishes on "$ROBOT_ID/..."
export function buildTopics(robotId) {
  return {
    WEBRTC_ANSWER: `${robotId}/webrtc/answer`,
    WEBRTC_CANDIDATE_ROBOT: `${robotId}/webrtc/candidate/robot`,
    WEBRTC_CANDIDATE_PC: `${robotId}/webrtc/candidate/pc`,
    WEBRTC_OFFER: `${robotId}/webrtc/offer`,
    STATUS: `${robotId}/status`,
    MENU: `${robotId}/menu`,
    MODE: `${robotId}/mode`,
    COMMANDS: `${robotId}/commands`,
    JOYSTICK: `${robotId}/joystick`,
  };
}

export const JOYSTICK_INTERVAL_MS = 100;