import React, {useEffect, useState} from 'react';

export default function App() {

    /*  Sample Question  */
    /*
    *  {
              questionText: 'Who is CEO of Tesla?',
              answerOptions: [
                  {answerText: 'Jeff Bezos', isCorrect: false},
                  {answerText: 'Elon Musk', isCorrect: true},
                  {answerText: 'Bill Gates', isCorrect: false},
                  {answerText: 'Tony Stark', isCorrect: false},
              ],
          },
    * */

    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        fetch('https://the-trivia-api.com/api/questions?categories=geography&limit=5&region=PK&difficulty=easy')
            .then(data => {
                return data.json();
            })
            .then(quiz => {
                // eslint-disable-next-line array-callback-return
                const modifyQuestions = quiz.map(q => {
                    const [incorrect1, incorrect2, incorrect3] = q.incorrectAnswers;
                    return {
                        questionText: q.question,
                        answerOptions: [
                            {
                                answerText: incorrect2, isCorrect: false
                            },
                            {
                                answerText: incorrect3, isCorrect: false
                            },
                            {
                                answerText: q.correctAnswer, isCorrect: true
                            },
                            {
                                answerText: incorrect1, isCorrect: false
                            }
                        ]
                    }
                });
                setQuestions(modifyQuestions);
            });
    }, []);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);

    const handleAnswerOptionClick = (isCorrect) => {
        if (isCorrect) {
            setScore(score + 1);
        }

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            setShowScore(true);
        }
    };
    return (
        <div className='app'>
            {showScore ? (
                <div className='score-section'>
                    You scored {score} out of {questions.length}
                    {/* eslint-disable-next-line no-restricted-globals */}
                    <button onClick={() => location.reload()}>Again Attempt?</button>
                </div>
            ) : (questions.length ? (
                <>
                    <div className='question-section'>
                        <div className='question-count'>
                            <span>Question {currentQuestion + 1}</span>/{questions.length}
                        </div>
                        <div className='question-text'>{questions[currentQuestion].questionText}</div>
                    </div>
                    <div className='answer-section'>
                        {questions[currentQuestion].answerOptions.map((answerOption, id) => (
                            <button key={id}
                                    onClick={() => handleAnswerOptionClick(answerOption.isCorrect)}>{answerOption.answerText}</button>
                        ))}
                    </div>
                </>
            ) : '')}
        </div>
    );
}