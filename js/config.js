// js/config.js
export const MQTT_CONFIG = {
  broker: "192.168.0.135",
  //broker: "100.69.184.106", //tailscale
  //broker: "10.69.85.57", //hotspot
  port: 9001,
  clientId: "DashboardWebRTC_" + Math.random().toString(16).substr(2, 8),
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
