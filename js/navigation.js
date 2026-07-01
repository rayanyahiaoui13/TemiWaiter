// js/navigation.js

import { TOPICS } from "./config.js";
import { state } from "./state.js";
import { publishData, publishRaw } from "./mqtt.js";
import {
  setTiltDisplay,
  resetTiltSlider,
  setFaceTrackButtonState,
} from "./ui.js";

export function sendGoTo(destinationName) {
  publishData(TOPICS.COMMANDS, {
    action: "goto",
    destination: destinationName,
  });
}

export function publishMode(mode) {
  publishRaw(TOPICS.MODE, mode);
}

export function setTiltAngle(angle) {
  publishData(TOPICS.COMMANDS, { tiltAngle: parseInt(angle, 10) });
  setTiltDisplay(angle);
}

export function toggleFaceTracking() {
  state.isFaceTrackingEnabled = !state.isFaceTrackingEnabled;
  publishData(TOPICS.COMMANDS, { faceTracking: state.isFaceTrackingEnabled });
  setFaceTrackButtonState(state.isFaceTrackingEnabled);

  if (!state.isFaceTrackingEnabled) {
    setTiltAngle(0);
    resetTiltSlider();
  }
}
