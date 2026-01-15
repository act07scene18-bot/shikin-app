const RATE = 0.08;
const KEY = "shikin_app";

function load() {
  return JSON.parse(localStorage.getItem(KEY)) || { A: null, history: [] };
}
function save(s) {
  localStorage.setItem(KEY, JSON.stringify(s));
}
function yen(n) {
  return n.toLocaleString();
}

let state = load();

const aView = document.getElementById("aView");
const bView = document.getElementById("bView");
const aInput = document.getElementById("aInput");
const cInput = document.getElementById("cInput");
const historyDiv = document.getElementById("history");

function render() {
  if (state.A === null) {
    aView.textContent = "-";
    bView.textContent = "-";
  } else {
    const B = Math.floor(state.A * RATE);
    aView.textContent = yen(state.A);
    bView.textContent = yen(B);
  }

  historyDiv.innerHTML = state.history.map(h =>
    `<div>${h.time}｜B:${yen(h.B)}｜C:${yen(h.C)}｜A:${yen(h.A)}</div>`
  ).reverse().join("");
}

document.getElementById("setA").onclick = () => {
  const v = Number(aInput.value);
  if (isNaN(v)) return;
  state.A = Math.floor(v);
  save(state);
  aInput.value = "";
  render();
};

document.getElementById("lose").onclick = () => {
  commit(0);
};

document.getElementById("hit").onclick = () => {
  const v = Number(cInput.value);
  if (isNaN(v)) return;
  commit(v);
};

function commit(C) {
  if (state.A === null) return;
  const B = Math.floor(state.A * RATE);
  const Anew = state.A - B + C;
  state.history.push({
    time: new Date().toLocaleString(),
    B: B,
    C: C,
    A: Anew
  });
  state.A = Anew;
  cInput.value = "";
  save(state);
  render();
}

render();
document.getElementById("resetAll").onclick = () => {
  if (confirm("履歴とAをすべてリセットします。よろしいですか？")) {
    localStorage.clear();
    location.reload();
  }
};
