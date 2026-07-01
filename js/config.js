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

export const TOPICS = {
  WEBRTC_ANSWER: "temi/webrtc/answer",
  WEBRTC_CANDIDATE_ROBOT: "temi/webrtc/candidate/robot",
  WEBRTC_CANDIDATE_PC: "temi/webrtc/candidate/pc",
  WEBRTC_OFFER: "temi/webrtc/offer",
  STATUS: "temi/status",
  MENU: "temi/menu",
  MODE: "temi/mode",
  COMMANDS: "temi/commands",
  JOYSTICK: "temi/joystick",
};

export const JOYSTICK_INTERVAL_MS = 100;
