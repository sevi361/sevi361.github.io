const apiUrl = "https://opentdb.com/api.php?";
const newQuestion = document.getElementById("newQuestion");
const mainContainer = document.getElementById("mainContainer");
const endScoreContainer = document.getElementById("endScoreContainer");
const answerContainer = document.getElementById("answerContainer");
const answerElements = answerContainer.children;
const submitButton = document.getElementById("submitButton");
const nextButton = document.getElementById("nextButton");
const score = document.getElementById("score");
const endScore = document.getElementById("endScore");
const endScoreMessage = document.getElementById("endScoreMessage");

//Definiere Variablen mit den URL Parametern

const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get("Category");
let amount = urlParams.get("Amount");
const time = urlParams.get("Time");
const difficulty = urlParams.get("Difficulty");
const mode = urlParams.get("Mode");

let apiCall;
let questionNr = 0;
let round = 0;
let points = 0;
let quiz;
let answers = [];
let chosenAnswer;
let selected = false;

window.addEventListener("load", function () {
  //Erst wenn Seite vollständig geladen wurde

  startGame();
});

function startGame() {
  mainContainer.classList.remove("containerDisabled");
  endScoreContainer.classList.add("containerDisabled");
  endScoreContainer.classList.remove("endScoreContainer");

  if (mode == "Time") {
    timer(time); //Starte Timer mit definierter Zeit
    amount = 100000; //Setze Anzahl an Fragen auf hohe Zahl (unendlich)
  }
  if (mode == "Endless") {
    amount = 100000; //Setze Anzahl an Fragen auf hohe Zahl (unendlich)
  }
  if (mode == "Custom") {
    timer(time);
  }

  if (category == "any" && difficulty == "any") {
    //Wenn keine spezifische Angabe zu Kategorie oder Schwierigkeit getroffen wurde
    apiCall = `amount=${amount}&type=multiple`;
    callApi(apiCall);
  }
  if (category == "any" && difficulty != "any") {
    //Wenn die Schwierigkeit definiert wurde, die Kategorie jedoch nicht
    apiCall = `amount=${amount}&type=multiple&difficulty=${difficulty}`;
    callApi(apiCall);
  }
  if (difficulty == "any" && category != "any") {
    //Wenn die Kategorie definiert wurde, die Schwierigkeit jedoch nicht
    apiCall = `amount=${amount}&category=${category}&type=multiple`;
    callApi(apiCall);
  }
}

function endGame() {
  //Container ein- & ausblenden (Während Spiel / Nach Spiel)

  mainContainer.classList.add("containerDisabled");
  endScoreContainer.classList.remove("containerDisabled");
  endScoreContainer.classList.add("endScoreContainer");
  endScoreMessage.innerHTML = "Congrats! Your score is:";
  endScore.innerHTML = `${points} / ${round}`;
}

function timer(s) {
  let timer = s;
  var x = setInterval(function () {
    //Ein Asynchroner Interval wird gestartet, welcher jede Sekunde (1000ms) den Timer um 1 senkt
    timer = timer - 1;
    document.getElementById("timer").innerHTML = timer;

    if (timer <= 0) {
      //Wenn Timer abgelaufen ist
      clearInterval(x); //Interval wird gestoppt
      endGame();
    }
  }, 1000);
}

function shuffleArray(array) {
  //Die Reihenfolge der Antwortmöglichkeiten durchmischen
  for (let i = array.length - 1; i > 0; i--) {
    //Für die Indexlänge des gegebenen Arrays wird eine zufälliger Index eines temporären Arrays überschrieben
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function decodeHtml(html) {
  //Weil es bei der Dekodierung des HTML Codes via API zu Formatierungs- "Fehlern" kommt, wird dies hier mit einem einfachen Trick behoben
  let txt = document.createElement("textarea");
  txt.innerHTML = html; //Ein pseudo Element wird mit dem HTML Code beschrieben
  return txt.value; //Der HTML Code wird richtig dekodiert zurückgegeben
}

function callApi(query) {
  //Die Query, welche in den Spieloptionen konfiguriert wird, wird in die Funktion gegeben
  fetch(apiUrl + query) //Die Fetch-Methode ist eine der Möglichkeiten, auf eine API zuzugreifen. Sie basiert auf Promises, welche, wie der Name sagt, verspricht, eine Antwort zu senden. Somit kann das Programm weiterlaufen, während es auf die Daten "wartet" (dauert Milisekunden)
    //Ein Promise kann verschiedene Status haben. Z.B. OK (success), Processing, Continue
    .then((response) => {
      //Die Antwort der API
      if (!response.ok) {
        //Wenn die Anfrage fehlgeschlagen ist
        console.log("Api call failed");
        alert("No Questions Available For This Category :(");
        window.location.replace("/index.html"); //Kehre zum Startbildschirm
      } else {
        if (response.status == 429) {
          //Fehler: "Too many requests" (Zu viele Anfragen) -> versuche es nocheinmal (Klingt paradox, funktioniert aber)
          callApi(apiCall);
          console.log("fehler");
        }
      }
      return response.json(); //Die Antwort wird als JSON Datei weitergegeben
    })
    .then((data) => {
      //Die Erhaltene Antwort
      if (data.results.length == 0) {
        //Wenn das Array der Antworten leer ist (ist vorgekommen)
        location.reload(); //Lade die Seite neu (Bzw. starte das Spiel neu)
      } else {
        quiz = data.results;
        //console.log(quiz);
        createQuiz();
      }
    });
}

function createQuiz() {
  if (round <= amount) {
    //Wenn die definierte Anzahl an Runden noch nicht erreicht ist
    if (questionNr >= 50 && questionNr % 50 == 0) {
      //API kann nur 50 Fragen (+ je 4 Antworten) auf eine Anfrage schicken -> Wenn diese Anzahl erreicht wurde, mach eine weitere Anfrage
      questionNr = 0;

      callApi(apiCall);
    }

    clearColor(); //Farben der Antwortknöpfe zurücksetzen
    score.innerHTML = `${points} / ${round}`;
    newQuestion.innerHTML = quiz[questionNr].question; //Frage wird in den innerHTML geschrieben
    answers = quiz[questionNr].incorrect_answers.concat(
      //Es wird ein gemeinsames Array aus richtiger und falschen Antworten erstellt
      quiz[questionNr].correct_answer
    );

    shuffleArray(answers); //Und dann gemischt

    for (let m = 0; m < 4; m++) {
      answerElements[m].innerHTML = answers[m]; //Antwortknöpfe werden mit Antwortmöglichkeiten gefüllt
    }
  } else {
    endGame();
  }
}

function inputAnswer(number) {
  clearColor();
  chosenAnswer = number - 1;
  answerElements[chosenAnswer].classList.add("answerButtonClicked"); //Farbe des angeclickten Knopfes ändert sich
  selected = true;
}

function submitAnswer() {
  if (selected) {
    for (let n = 0; n < 4; n++) {
      answerElements[n].disabled = true; //Knöpfe werden disabled
    }
    submitButton.style.display = "none"; //Submit Knopf wird ausgeblendet
    nextButton.style.display = "inline-block"; //Next Knopf wird eingeblendet

    if (
      //Wenn die eingegebene Antwort der richtigen Antwort entspricht, gebe dem Spieler einen Punkt
      answerElements[chosenAnswer].innerHTML ==
      decodeHtml(quiz[questionNr].correct_answer)
    ) {
      points = points + 1;

      answerElements[chosenAnswer].classList.add("answerButtonCorrect"); //Die Farbe des Knopfes wird Grün
    } else {
      showSolution();

      answerElements[chosenAnswer].classList.add("answerButtonWrong");
    }
    round = round + 1; //Rundenzahl wird erhöht
    questionNr = questionNr + 1;
  } else {
    alert("please select an answer"); //Spieler muss eine Antwort geben, sonst Alert
  }
  selected = false;
}

function showSolution() {
  for (let k = 0; k < answers.length; k++) {
    //Für jede der Antwortmöglichkeiten in den Knöpfen wird überprüft, welche mit der richtigen Antwort übereinstimmt
    if (answers[k] == quiz[questionNr].correct_answer) {
      answerElements[k].classList.add("answerButtonCorrect"); //Dieser wird dann grün gefärbt
    }
  }
}

function clearColor() {
  for (let l = 0; l < 4; l++) {
    //Farben der Knöpfe werden zurückgesetzt
    answerElements[l].classList.remove("answerButtonCorrect");
    answerElements[l].classList.remove("answerButtonWrong");
    answerElements[l].classList.remove("answerButtonClicked");
    answerElements[l].disabled = false;
  }

  submitButton.style.display = "inline-block";
  nextButton.style.display = "none";
}

//api: https://opentdb.com/api_config.php
