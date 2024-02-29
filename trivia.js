const apiUrl = "https://opentdb.com/api.php?";
const newQuestion = document.getElementById("newQuestion");
const answerContainer = document.getElementById("answerContainer");
const answerElements = answerContainer.children;
const submitButton = document.getElementById("submitButton");
const nextButton = document.getElementById("nextButton");
let score = document.getElementById("score");
var round;
var points = 0;
let quiz;
var answers = [];
var chosenAnswer;

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function decodeHtml(html) {
  var txt = document.createElement("textarea");
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
  //console.log(answers);
  answerElements[0].innerHTML = answers[0];
  answerElements[1].innerHTML = answers[1];
  answerElements[2].innerHTML = answers[2];
  answerElements[3].innerHTML = answers[3];
}

function inputAnswer(number) {
  clearColor();
  chosenAnswer = number - 1;
  answerElements[chosenAnswer].style.backgroundColor = "lightgrey";
}

function submitAnswer() {
  if (
    answerElements[chosenAnswer].innerHTML ==
    decodeHtml(quiz[round].correct_answer)
  ) {
    round = round + 1;
    points = points + 1;
    //console.log(round);
    answerElements[chosenAnswer].style.backgroundColor = "lightgreen";
    answerElements[0].disabled = true;
    answerElements[1].disabled = true;
    answerElements[2].disabled = true;
    answerElements[3].disabled = true;
    submitButton.style.display = "none";
    nextButton.style.display = "inline-block";
  } else {
    showSolution();
    round = round + 1;
    //console.log("wrong answer");
    answerElements[chosenAnswer].style.backgroundColor = "rgb(254, 76, 76)";
    answerElements[0].disabled = true;
    answerElements[1].disabled = true;
    answerElements[2].disabled = true;
    answerElements[3].disabled = true;
    submitButton.style.display = "none";
    nextButton.style.display = "inline-block";
  }
}

function showSolution() {
  console.log("solution:" + answers.length);
  for (let k = 0; k < answers.length; k++) {
    console.log("OK");
    if (answers[k] == quiz[round].correct_answer) {
      answerElements[k].style.backgroundColor = "lightgreen";
    }
  }
}

function clearColor() {
  answerElements[0].style.backgroundColor = "white";
  answerElements[1].style.backgroundColor = "white";
  answerElements[2].style.backgroundColor = "white";
  answerElements[3].style.backgroundColor = "white";
  submitButton.style.display = "inline-block";
  nextButton.style.display = "none";
  answerElements[0].disabled = false;
  answerElements[1].disabled = false;
  answerElements[2].disabled = false;
  answerElements[3].disabled = false;
}

function resetScore() {
  score.innerHTML = `0 / 1`;
}

callApi("amount=50&category=9&type=multiple");
resetScore();

//api: https://opentdb.com/api_config.php
