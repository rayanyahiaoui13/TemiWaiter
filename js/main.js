import { initMqtt } from "./mqtt.js";
import { startWebRTCCall, toggleMute, toggleVideo } from "./webrtc.js";
import { sendGoTo, setTiltAngle, toggleFaceTracking } from "./navigation.js";
import { startJoy, stopJoy, initKeyboardControls } from "./teleop.js";
import { clearLiveCart } from "./cart.js";

function bindControlCenter() {
  document
    .getElementById("btn-call")
    .addEventListener("click", startWebRTCCall);
  document.getElementById("btn-mute").addEventListener("click", toggleMute);
  document.getElementById("btn-video").addEventListener("click", toggleVideo);
}

function bindNavigation() {
  document.querySelectorAll("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", () => sendGoTo(btn.dataset.goto));
  });
}

function bindDPad() {
  const dpad = {
    up: [1.0, 0.0],
    left: [0.0, 0.5],
    down: [-1.0, 0.0],
    right: [0.0, -0.5],
  };

  Object.entries(dpad).forEach(([dir, [speed, rotation]]) => {
    const btn = document.querySelector(`[data-dpad="${dir}"]`);
    if (!btn) return;
    const start = () => startJoy(speed, rotation);
    btn.addEventListener("mousedown", start);
    btn.addEventListener("touchstart", start);
    btn.addEventListener("mouseup", stopJoy);
    btn.addEventListener("mouseleave", stopJoy);
    btn.addEventListener("touchend", stopJoy);
  });
}

function bindTiltAndFaceTrack() {
  document
    .querySelector('input[type="range"]')
    .addEventListener("input", (e) => setTiltAngle(e.target.value));
  document
    .getElementById("btn-facetrack")
    .addEventListener("click", toggleFaceTracking);
}

function bindCart() {
  document
    .getElementById("clear-cart-btn")
    .addEventListener("click", clearLiveCart);
}

document.addEventListener("DOMContentLoaded", () => {
  bindControlCenter();
  bindNavigation();
  bindDPad();
  bindTiltAndFaceTrack();
  bindCart();
  initKeyboardControls();
  initMqtt();
});
