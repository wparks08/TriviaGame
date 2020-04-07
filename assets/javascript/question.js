class Question {
    /**
     * 
     * @param {string} question 
     * @param {Array} options 
     * @param {number} answerIndex 
     */
    constructor(question, options, answerIndex) {
        this.question = question;
        this.options = options;
        this.answerIndex = answerIndex;
        this.answeredCorrectly = false;
    }

    answer(index) {
        this.answeredCorrectly = index === this.answerIndex;
    }

    getCorrectAnswer() {
        return this.options[this.answerIndex];
    }

    getOptions(callback) {
        return this.options.map((option, index) => callback(option, index));
    }
}