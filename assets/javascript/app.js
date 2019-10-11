const questions = [
    new Question(
        "Sample Question",
        ["Sample Answer 1", "Sample Answer 2", "Sample Answer 3", "Sample Answer 4"],
        1
    ),
    new Question(
        "Sample Question number 2",
        ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
        3
    )
]; //probably move this to a standalone js file later

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
            .on("click", processAnswer);
        $("#options").append(optionElement);
    });
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
        $("#options").append(
            $("<h3>Out of time!</h3>")
                .on("click", nextQuestion)
            );
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
    $("#options").append(
        $("<h3>Correct!</h3>")
            .on("click", nextQuestion)
    );
}

function showIncorrect() {
    $("#options").append(
        $("<h3>Inorrect!</h3>")
            .on("click", nextQuestion)
    );
}

function showResults() {
    clearOptions();
    clearQuestion();
    clearTimers();
    $("#options")
        .append($("<h3>Game has ended!</h3>"))
        .append($(`<h4>Correct answers: ${correctAnswers}</h4>`))
        .append($(`<h4>Incorrect answers: ${incorrectAnswers}</h4>`))
        .append(
            $("<button id='start-game' class='btn btn-primary'>Start Game</button>")
                .on("click", startGame)
            );
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

$("#start-game").on("click", startGame);