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

function buildOrderCsv(payload) {
  let csv = "data:text/csv;charset=utf-8,\uFEFF";
  csv += "Date_Time;Item;Price_RM\n";

  if (Array.isArray(payload.items)) {
    payload.items.forEach((item) => {
      csv += `${payload.timestamp};${item.name};${item.price.toFixed(2)}\n`;
    });
  }

  const safeTotal = payload.total ? payload.total.toFixed(2) : "0.00";
  csv += `;;TOTAL : ${safeTotal}\n`;
  return { csv, safeTotal };
}

function downloadCsv(csvContent, timestamp) {
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  const safeFileName = timestamp ? timestamp.replace(/[: ]/g, "_") : "Order";
  link.setAttribute("download", `Temi_Order_${safeFileName}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function handleOrderValidation(payload) {
  const { csv, safeTotal } = buildOrderCsv(payload);
  downloadCsv(csv, payload.timestamp);

  new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg")
    .play()
    .catch(() => {});

  const itemCount = payload.items ? payload.items.length : 0;
  addLogEntry(
    `ORDER VALIDATED: ${itemCount} items (Total: RM${safeTotal})`,
    "text-green-500",
    true,
  );
  clearLiveCart();
}
