// js/ui.js

import { MENU_PRICES } from "./config.js";
import { state } from "./state.js";

const els = {
  statusBar: () => document.getElementById("status-bar"),
  cartList: () => document.getElementById("live-cart-list"),
  cartTotal: () => document.getElementById("live-cart-total"),
  activityLog: () => document.getElementById("menu-notifications"),
  currentPage: () => document.getElementById("client-current-page"),
  tiltValue: () => document.getElementById("tilt-value"),
  tiltSlider: () => document.querySelector('input[type="range"]'),
  btnCall: () => document.getElementById("btn-call"),
  btnMute: () => document.getElementById("btn-mute"),
  btnVideo: () => document.getElementById("btn-video"),
  btnFaceTrack: () => document.getElementById("btn-facetrack"),
};

export function setConnectionStatus(connected, message) {
  const sb = els.statusBar();
  sb.classList.toggle("bg-green-600", connected);
  sb.classList.toggle("bg-red-600", !connected);
  sb.innerText = message;
}

export function renderCart() {
  const list = els.cartList();
  const totalEl = els.cartTotal();

  if (state.liveCart.length === 0) {
    list.innerHTML = '<li class="text-gray-500 italic">Empty cart...</li>';
    totalEl.innerText = "Total: RM0.00";
    return;
  }

  list.innerHTML = "";
  let total = 0;
  state.liveCart.forEach((item) => {
    const price = MENU_PRICES[item] || 0;
    total += price;
    const li = document.createElement("li");
    li.innerText = `✓ ${item} - RM${price.toFixed(2)}`;
    list.appendChild(li);
  });
  totalEl.innerText = `Total: RM${total.toFixed(2)}`;
}

export function addLogEntry(
  text,
  colorClass = "text-yellow-500",
  bold = false,
) {
  const list = els.activityLog();
  if (list && list.innerHTML.includes("Waiting")) list.innerHTML = "";
  const li = document.createElement("li");
  li.innerText = text;
  li.className = `${colorClass} ${bold ? "font-bold" : ""}`;
  if (list) list.prepend(li);
}

export function setCurrentPage(pageLabel) {
  const el = els.currentPage();
  if (el) el.innerText = pageLabel;
}

export function setTiltDisplay(angle) {
  els.tiltValue().innerText = `${angle}°`;
}

export function resetTiltSlider() {
  els.tiltSlider().value = 0;
}

export function setCallButtonActive() {
  const btn = els.btnCall();
  btn.innerText = "Call Active";
  btn.classList.replace("bg-temi-orange", "bg-green-600");
  btn.classList.replace("hover:bg-temi-orange-hover", "hover:bg-green-700");
}

export function setMuteButtonState(isMuted) {
  const btn = els.btnMute();
  btn.innerText = isMuted ? "Unmute Mic" : "Mute Mic";
  btn.classList.toggle("bg-red-600", isMuted);
  btn.classList.toggle("hover:bg-red-700", isMuted);
  btn.classList.toggle("bg-temi-button", !isMuted);
  btn.classList.toggle("hover:bg-temi-button-hover", !isMuted);
}

export function setVideoButtonState(isStopped) {
  const btn = els.btnVideo();
  btn.innerText = isStopped ? "Enable Video" : "Disable Video";
  btn.classList.toggle("bg-red-600", isStopped);
  btn.classList.toggle("hover:bg-red-700", isStopped);
  btn.classList.toggle("bg-temi-button", !isStopped);
  btn.classList.toggle("hover:bg-temi-button-hover", !isStopped);
}

export function setFaceTrackButtonState(isEnabled) {
  const btn = els.btnFaceTrack();
  btn.innerText = isEnabled ? "Follow Me: ON" : "Follow Me: OFF";
  btn.classList.toggle("bg-green-600", isEnabled);
  btn.classList.toggle("hover:bg-green-700", isEnabled);
  btn.classList.toggle("bg-temi-button", !isEnabled);
  btn.classList.toggle("hover:bg-gray-500", !isEnabled);
}
