const modeMenu = document.getElementById("modeMenu");
const modeButtons = modeMenu.children;

function Redirect() {
  window.location.href = "/trivia.html";
}

function modeSelection(button, mode) {
  for (let l = 0; l < 3; l++) {
    modeButtons[l].classList.remove("modeButtonSelected");
  }
  modeButtons[button].classList.add("modeButtonSelected");
  document.getElementById("modeField").value = mode;
}
