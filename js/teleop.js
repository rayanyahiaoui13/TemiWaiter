// js/teleop.js

import { JOYSTICK_INTERVAL_MS } from "./config.js";
import { state } from "./state.js";
import { publishData } from "./mqtt.js";

export function startJoy(speed, rotation) {
  if (!state.topics) return;
  state.currentSpeed = speed;
  state.currentRotation = rotation;
  publishData(state.topics.JOYSTICK, {
    speed: state.currentSpeed,
    rotation: state.currentRotation,
  });

  if (state.movementLoop) clearInterval(state.movementLoop);
  state.movementLoop = setInterval(() => {
    publishData(state.topics.JOYSTICK, {
      speed: state.currentSpeed,
      rotation: state.currentRotation,
    });
  }, JOYSTICK_INTERVAL_MS);
}

export function stopJoy() {
  if (state.movementLoop) {
    clearInterval(state.movementLoop);
    state.movementLoop = null;
  }
  state.currentSpeed = 0.0;
  state.currentRotation = 0.0;
  if (state.topics) publishData(state.topics.JOYSTICK, { speed: 0.0, rotation: 0.0 });
}

function updateJoystickFromKeys() {
  let s = 0.0;
  let r = 0.0;
  if (state.activeKeys.ArrowUp) s = 1.0;
  if (state.activeKeys.ArrowDown) s = -1.0;
  if (state.activeKeys.ArrowLeft) r = 0.5;
  if (state.activeKeys.ArrowRight) r = -0.5;

  if (s === 0.0 && r === 0.0) stopJoy();
  else startJoy(s, r);
}

export function initKeyboardControls() {
  document.addEventListener("keydown", (event) => {
    if (!(event.key in state.activeKeys)) return;
    event.preventDefault();
    if (!state.activeKeys[event.key]) {
      state.activeKeys[event.key] = true;
      updateJoystickFromKeys();
    }
  });

  document.addEventListener("keyup", (event) => {
    if (!(event.key in state.activeKeys)) return;
    event.preventDefault();
    state.activeKeys[event.key] = false;
    updateJoystickFromKeys();
  });
}