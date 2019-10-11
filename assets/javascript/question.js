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
        this.optionCount = options.length;
        this.answerIndex = answerIndex;
        this.answeredCorrectly = false;
    }

    answer(index) {
        this.answeredCorrectly = index == this.answerIndex;
    }

    getOption(index) {
        return options[index];
    }
}