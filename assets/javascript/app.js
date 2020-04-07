let currentQuestion;
let questionIndex = 0;
const numberOfQuestions = questions.length;
let correctAnswers = 0;
let incorrectAnswers = 0;
let answerGiven;

const SECONDS_TO_ANSWER = 30;
const SECONDS_TO_REVIEW = 10;
let secondsRemaining = 0;
let intervalId;
let timeoutId;

const $cursor = $("<img>")
    .attr("src", "assets/images/FF7Cursor.png")
    .attr("alt", "selected option")
    .addClass("selected");

function startGame() {
    init();
    $("#timer").html("Time Remaining: <span id='seconds'></span> seconds");
    currentQuestion = questions[0];
    showQuestion();
}

function init() {
    questionIndex = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
}

function nextQuestion() {
    hasNextQuestion()
        ? loadNextQuestion() && showQuestion()
        : showResults();
}

function hasNextQuestion() {
    return (questionIndex + 1) < numberOfQuestions;
}

function loadNextQuestion() {
    questionIndex++;
    currentQuestion = questions[questionIndex];
    return currentQuestion; //truthy. Not sure I like this, may change later.
}

function showQuestion() {
    answerGiven = false;
    setTimer(SECONDS_TO_ANSWER);
    startTimer(showReview);
    showQuestionText();
    showOptions();
}

function showQuestionText() {
    $("#question").text(currentQuestion.question);
}

function clearOptions() {
    $("#options").empty();
}

function showOptions() {
    clearOptions();
    const $optionsArray = currentQuestion.getOptions(createOptionElement);
    $("#options").append($optionsArray);
}

function createOptionElement(option, index) {
    const $option = $("<h3>")
        .addClass("text-center option")
        .text(option)
        .attr("data-index", index)
        .on("click", processAnswer);
    addCursorOnHover($option);
    return $option
}

function addCursorOnHover(element) {
    $(element).on("mouseover", showCursor)
        .on("mouseout", hideCursor);
}

function showCursor() {
    $(this).prepend($cursor);
    playSelectSound();
}

function playSelectSound() {
    let audio = new Audio("assets/sounds/Select.mp3");
    audio.play();
}

function hideCursor() {
    $(".option .selected").remove();
}

function processAnswer() {
    currentQuestion.answer($(this).data("index"));
    answerGiven = true;
    showReview()
}

function showReview() {
    clearOptions();
    answerGiven ? showAnswerResult() : showOutOfTime();
    setTimer(SECONDS_TO_REVIEW);
    startTimer(nextQuestion);
}

function showAnswerResult() {
    if (currentQuestion.answeredCorrectly) {
        showCorrect();
        correctAnswers++;
    } else {
        showIncorrect();
        incorrectAnswers++;
    }
}

function showOutOfTime() {
    let outOfTime = createNextQuestionElement("Out of time!");
    let correctAnswer = createCorrectAnswerElement(currentQuestion.getCorrectAnswer());
    $("#options").append([outOfTime, correctAnswer]);
    addCursorOnHover(outOfTime);
}

function showCorrect() {
    let correctElement = createNextQuestionElement("Correct!");
    $("#options").append(correctElement);
    addCursorOnHover(correctElement);
}

function showIncorrect() {
    let incorrectElement = createNextQuestionElement("Incorrect!");
    let correctAnswer = createCorrectAnswerElement(currentQuestion.getCorrectAnswer());
    $("#options").append([incorrectElement, correctAnswer]);
    addCursorOnHover(incorrectElement);
}

function createNextQuestionElement(text) {
    return $(`<h3>${text}</h3>`)
        .addClass("option")
        .on("click", nextQuestion);
}

function createCorrectAnswerElement(answer) {
    return $("<h3>")
        .html(`The correct answer was:<br>${answer}`);
}

function showResults() {
    let victory = new Audio("assets/sounds/Victory-Fanfare.mp3");
    victory.play();
    clearOptions();
    clearQuestion();
    clearTimers();
    let startGameElement = $("<h2 id='start-game' class='mt-5 option'>Start Game</h2>")
        .on("click", function () {
            victory.pause();
            startGame();
        });
    $("#timer").html("Click Start Game to play again!");
    $("#options")
        .append($(`<h4>Correct answers: ${correctAnswers}</h4>`))
        .append($(`<h4>Incorrect answers: ${incorrectAnswers}</h4>`))
        .append(startGameElement);
    addCursorOnHover(startGameElement);
}

function clearQuestion() {
    $("#question").empty();
}

function clearTimers() {
    clearInterval(intervalId);
    clearTimeout(timeoutId);
}

function showSecondsRemaining() {
    $("#seconds").text(secondsRemaining);
}

function setTimer(time) {
    secondsRemaining = time;
    showSecondsRemaining();
}

function startTimer(onComplete) {
    clearTimers();
    intervalId = setInterval(decrement, 1000);
    timeoutId = setTimeout(onComplete, secondsRemaining * 1000);
}

function decrement() {
    if (secondsRemaining > 0) {
        secondsRemaining--;
        showSecondsRemaining();
    } else {
        clearInterval(intervalId);
        console.log("Timer done");
    }
}

let startButton = $("#start-game");
startButton.on("click", startGame);
addCursorOnHover(startButton);