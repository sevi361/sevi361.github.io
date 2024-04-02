const apiUrl = "https://opentdb.com/api.php?";
const newQuestion = document.getElementById("newQuestion");
const answerContainer = document.getElementById("answerContainer");
const answerElements = answerContainer.children;
const submitButton = document.getElementById("submitButton");
const nextButton = document.getElementById("nextButton");
let score = document.getElementById("score");
let mode;
let round;
let points = 0;
let quiz;
let answers = [];
let chosenAnswer;
let selected = false;

// document.addEventListener("keydown", function (event) {
//   if (event.key == " ") {
//     submitAnswer();
//   }
// });

window.addEventListener("load", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("Category");
  const amount = urlParams.get("Amount");
  mode = urlParams.get("Mode");
  resetScore();

  startGame();

  callApi(`amount=${amount}&category=${category}&type=multiple`);
  console.log(category);
});

function startGame() {
  if (mode == "Time") {
    //..
  }
  if (mode == "Endless") {
    console.log("endless mode");
  }
  if (mode == "Custom") {
  } else {
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function decodeHtml(html) {
  let txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function callApi(query) {
  fetch(apiUrl + query)
    .then((response) => {
      if (!response.ok) {
        console.log("Api call failed");
      }
      return response.json();
    })
    .then((data) => {
      quiz = data.results;
      console.log(quiz);
      round = 0;
      createQuiz();
    });
}

function createQuiz() {
  clearColor();
  score.innerHTML = `${points} / ${round}`;
  newQuestion.innerHTML = quiz[round].question;
  answers = quiz[round].incorrect_answers.concat(quiz[round].correct_answer);
  //console.log(answers);
  shuffleArray(answers);

  for (let m = 0; m < 4; m++) {
    answerElements[m].innerHTML = answers[m];
  }
}

function inputAnswer(number) {
  clearColor();
  chosenAnswer = number - 1;
  answerElements[chosenAnswer].classList.add("answerButtonClicked");
  selected = true;
}

function submitAnswer() {
  if (selected) {
    for (let n = 0; n < 4; n++) {
      answerElements[n].disabled = true;
    }
    submitButton.style.display = "none";
    nextButton.style.display = "inline-block";

    if (
      answerElements[chosenAnswer].innerHTML ==
      decodeHtml(quiz[round].correct_answer)
    ) {
      points = points + 1;
      //console.log(round);
      answerElements[chosenAnswer].classList.add("answerButtonCorrect");
    } else {
      showSolution();
      //console.log("wrong answer");
      answerElements[chosenAnswer].classList.add("answerButtonWrong");
    }
    round = round + 1;
  } else {
    alert("please select an answer");
  }
  selected = false;
}

function showSolution() {
  console.log("solution:" + answers.length);
  for (let k = 0; k < answers.length; k++) {
    console.log("OK");
    if (answers[k] == quiz[round].correct_answer) {
      answerElements[k].classList.add("answerButtonCorrect");
    }
  }
}

function clearColor() {
  for (let l = 0; l < 4; l++) {
    answerElements[l].classList.remove("answerButtonCorrect");
    answerElements[l].classList.remove("answerButtonWrong");
    answerElements[l].classList.remove("answerButtonClicked");
    answerElements[l].disabled = false;
  }

  submitButton.style.display = "inline-block";
  nextButton.style.display = "none";
}

function resetScore() {
  score.innerHTML = `0 / 1`;
}

//api: https://opentdb.com/api_config.php
