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

const SECONDS_TO_ANSWER = 30;
const SECONDS_TO_REVIEW = 10;
var secondsRemaining = 0;
var intervalId;
var timeoutId;

function startGame() {
    currentQuestion = questions[0];
    showQuestion();
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
    console.log(currentQuestion.isAnswerCorrect($(this).data("index")));
    showReview()
}

function showReview() {
    clearOptions();
    $("#options").append($("<h3>Out of time!</h3>"));
    setTimer(SECONDS_TO_REVIEW);
    startTimer(nextQuestion);
}

function showResults() {
    clearOptions();
    $("#options").append($("<h3>Game has ended!</h3>"));
}

function showSecondsRemaining() {
    $("#seconds").text(secondsRemaining);
}

function setTimer(time) {
    secondsRemaining = time;
    showSecondsRemaining();
}

function startTimer(onComplete) {
    clearInterval(intervalId);
    clearTimeout(timeoutId);
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

startGame();