// js/cart.js

import { state } from "./state.js";
import { renderCart, addLogEntry } from "./ui.js";

export function clearLiveCart() {
  state.liveCart = [];
  renderCart();
}

export function addToCart(itemName) {
  state.liveCart.push(itemName);
  renderCart();
}

export function handleOrderValidation(payload) {
  const itemCount = payload.items ? payload.items.length : 0;
  const total = payload.total ? payload.total.toFixed(2) : "0.00";

  new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg")
    .play()
    .catch(() => {});

  addLogEntry(
    `ORDER SENT TO KITCHEN: ${itemCount} items (Total: RM${total})`,
    "text-green-500",
    true,
  );
  clearLiveCart();
}
