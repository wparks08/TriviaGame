var currentQuestion;
var questionIndex = 0;
const numberOfQuestions = questions.length;
var correctAnswers = 0;
var incorrectAnswers = 0;
var answerGiven;

const SECONDS_TO_ANSWER = 30;
const SECONDS_TO_REVIEW = 10;
var secondsRemaining = 0;
var intervalId;
var timeoutId;

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
    if (++questionIndex < numberOfQuestions) {
        currentQuestion = questions[questionIndex];
        showQuestion();
    } else {
        clearOptions();
        showResults();
    }
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
    $.each(currentQuestion.options, function (index, option) {
        let optionElement = $("<h3>");
        optionElement
            .addClass("text-center option")
            .text(option)
            .attr("data-index", index)
            .on("click", processAnswer)
        $("#options").append(optionElement);
        addCursorOnHover(optionElement);
    });
}

function addCursorOnHover(element) {
    $(element).on("mouseover", showCursor)
              .on("mouseout", hideCursor);
}

function showCursor() {
    let img = $("<img>")
        .attr("src", "assets/images/FF7Cursor.png")
        .addClass("selected");
    $(this).prepend(img);
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
    if (answerGiven) {
        showAnswerResult();
    } else {
        let outOfTime = $("<h3>Out of time!</h3>")
            .addClass("option")
            .on("click", nextQuestion);
        let correctAnswer = $("<h3>")
            .html(`The correct answer was:<br>${currentQuestion.options[currentQuestion.answerIndex]}`);
        $("#options").append([outOfTime, correctAnswer]);
        addCursorOnHover(outOfTime);
    }
    
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

function showCorrect() {
    let correctElement = $("<h3>Correct!</h3>")
        .addClass("option")
        .on("click", nextQuestion);
    $("#options").append(correctElement);
    addCursorOnHover(correctElement);
}

function showIncorrect() {
    let incorrectElement = $("<h3>Incorrect!</h3>")
        .addClass("option")
        .on("click", nextQuestion);
    let correctAnswer = $("<h3>")
        .html(`The correct answer was:<br>${currentQuestion.options[currentQuestion.answerIndex]}`);
    $("#options").append([incorrectElement, correctAnswer]);
    addCursorOnHover(incorrectElement);
    
}

function showResults() {
    let victory = new Audio("assets/sounds/Victory-Fanfare.mp3");
    victory.play();
    clearOptions();
    clearQuestion();
    clearTimers();
    let startGameElement = $("<h2 id='start-game' class='mt-5 option'>Start Game</h2>")
        .on("click", function() {
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