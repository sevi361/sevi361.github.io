const gameMenu = document.getElementById("gameMenu");
const modeMenu = document.getElementById("modeMenu");
const modeButtons = modeMenu.children;
const amountSelector = document.getElementById("amountSelector");
const timeSelector = document.getElementById("timeSelector");
const difficultySelector = document.getElementById("difficultySelector");

window.addEventListener("load", function () {
  gameMenu.classList.add("containerDisabled"); //Erweitertes Game Menu aus stylistischen Gründen zu Beginn versteckt
});

function modeSelection(button, mode) {
  //Beim Auswählen von eines der drei Modi, wird das erweiterte Game Menu gezeigt
  gameMenu.classList.remove("containerDisabled");
  for (let l = 0; l < 3; l++) {
    modeButtons[l].classList.remove("modeButtonSelected"); //Beim Drücken eines Knopfes, wird der zuvor gedrückte Knopf "abgewählt" (visuell)
  }
  modeButtons[button].classList.add("modeButtonSelected"); //Und der gedrückte "angewählt"
  document.getElementById("modeField").value = mode; //Damit ich später auf den Modus über die URL Params zugreifen kann, beschreibe ich ein psuedo Input Feld mit dem Wert des Modus
  if (mode == "Endless") {
    //Anzeigen / Ausblenden der Input Feldern
    amountSelector.classList.add("containerDisabled");
    timeSelector.classList.add("containerDisabled");
    difficultySelector.classList.add("containerDisabled");
  }
  if (mode == "Time") {
    amountSelector.classList.add("containerDisabled");
    timeSelector.classList.remove("containerDisabled");
    difficultySelector.classList.add("containerDisabled");
  }
  if (mode == "Custom") {
    amountSelector.classList.remove("containerDisabled");
    timeSelector.classList.remove("containerDisabled");
    difficultySelector.classList.remove("containerDisabled");
  }
}
