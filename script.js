let current = "0";
let previous = null;
let operator = null;
let busy = false;   // true while the wave is scanning

const currentEl = document.getElementById("current");
const historyEl = document.getElementById("history");
const screenEl = document.querySelector(".screen");

function updateScreen() {
  currentEl.textContent = current;
  historyEl.textContent = operator ? `${previous} ${operator}` : "";
}

// Play the wave + "Analyzing...", then reveal the result
function scanThenShow(text) {
  busy = true;
  screenEl.classList.add("scanning");
  currentEl.classList.add("hidden");

  setTimeout(() => {
    screenEl.classList.remove("scanning");
    currentEl.textContent = text;
    currentEl.classList.remove("hidden");
    busy = false;
  }, 1500);   // must match the 1.5s in style.css
}

function inputNumber(digit) {
  if (digit === "." && current.includes(".")) return;
  current = current === "0" && digit !== "." ? digit : current + digit;
  updateScreen();
}

function chooseOperator(op) {
  if (operator && previous !== null) calculate(false);
  previous = current;
  operator = op;
  current = "0";
  updateScreen();
}

function calculate(animate) {
  if (operator === null || previous === null) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  const op = operator;
  let result;

  if (op === "+") result = a + b;
  if (op === "−") result = a - b;
  if (op === "×") result = a * b;
  if (op === "÷") {
    if (b === 0) {
      clearAll();
      currentEl.textContent = "Can't divide by 0";
      return;
    }
    result = a / b;
  }

  current = String(parseFloat(result.toFixed(10)));
  previous = null;
  operator = null;

  if (animate) {
    historyEl.textContent = `${a} ${op} ${b} =`;
    scanThenShow(current);
  } else {
    updateScreen();
  }
}

function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  updateScreen();
}

function deleteLast() {
  current = current.length > 1 ? current.slice(0, -1) : "0";
  updateScreen();
}

function percent() {
  current = String(parseFloat(current) / 100);
  updateScreen();
}

document.querySelector(".keys").addEventListener("click", (event) => {
  if (busy) return;
  const btn = event.target.closest("button");
  if (!btn) return;

  if (btn.dataset.num !== undefined) inputNumber(btn.dataset.num);
  else if (btn.dataset.op) chooseOperator(btn.dataset.op);
  else if (btn.dataset.action === "equals") calculate(true);
  else if (btn.dataset.action === "clear") clearAll();
  else if (btn.dataset.action === "delete") deleteLast();
  else if (btn.dataset.action === "percent") percent();
});

document.addEventListener("keydown", (e) => {
  if (busy) return;
  if ("0123456789.".includes(e.key)) inputNumber(e.key);
  else if (e.key === "+") chooseOperator("+");
  else if (e.key === "-") chooseOperator("−");
  else if (e.key === "*") chooseOperator("×");
  else if (e.key === "/") { e.preventDefault(); chooseOperator("÷"); }
  else if (e.key === "Enter" || e.key === "=") calculate(true);
  else if (e.key === "Backspace") deleteLast();
  else if (e.key === "Escape") clearAll();
});