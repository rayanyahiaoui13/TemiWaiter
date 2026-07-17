// js/state.js
export const state = {
  peerConnection: null,
  localStream: null,
  isMuted: false,
  isVideoStopped: false,
  isFaceTrackingEnabled: false,
  liveCart: [],
  movementLoop: null,
  currentSpeed: 0.0,
  currentRotation: 0.0,
  activeKeys: {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  },
  locations: [],

  // Multi-robot support
  currentRobotId: null,
  topics: null,

  // Battery
  batteryLevel: null,
  isCharging: false,
};
