import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quiz = () => {
  const savedData = JSON.parse(localStorage.getItem('quizProgress')) || {};

  const [questions, setQuestions] = useState(savedData.questions || []);
  const [currentQuestion, setCurrentQuestion] = useState(savedData.currentQuestion || 0);
  const [score, setScore] = useState(savedData.score || 0);
  const [showScore, setShowScore] = useState(savedData.showScore || false);
  const [timeLeft, setTimeLeft] = useState(savedData.timeLeft || 60);
  const [isTimerRunning, setIsTimerRunning] = useState(savedData.isTimerRunning || false);
  const [shuffledAnswers, setShuffledAnswers] = useState(savedData.shuffledAnswers || []);

  // Menyimpan data ke localStorage setiap kali state berubah
  useEffect(() => {
    const quizProgress = {
      questions,
      currentQuestion,
      score,
      showScore,
      timeLeft,
      isTimerRunning,
      shuffledAnswers,
    };
    localStorage.setItem('quizProgress', JSON.stringify(quizProgress));
  }, [questions, currentQuestion, score, showScore, timeLeft, isTimerRunning, shuffledAnswers]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (questions.length > 0) return;

      try {
        const response = await axios.get('https://opentdb.com/api.php?amount=10&type=multiple');
        setQuestions(response.data.results);
        setIsTimerRunning(true);
      } catch (error) {
        console.error("Error fetching questions: ", error);
      }
    };

    fetchQuestions();
  }, [questions]);

  // Acak jawaban
  useEffect(() => {
    if (questions.length > 0) {
      const currentQ = questions[currentQuestion];
      const answers = [...currentQ.incorrect_answers, currentQ.correct_answer];
      answers.sort(() => Math.random() - 0.5);
      setShuffledAnswers(answers);
    }
  }, [currentQuestion, questions]);

  // Timer countdown
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setShowScore(true);
      setIsTimerRunning(false);
    }
  }, [timeLeft, isTimerRunning]);

  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimeLeft(60);
    } else {
      setShowScore(true);
      setIsTimerRunning(false);
    }
  };

  // Fungsi mereset quiz dan menghapus dari localStorage
  const resetQuiz = () => {
    localStorage.removeItem('quizProgress');
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setTimeLeft(10);
    setIsTimerRunning(false);
    setShuffledAnswers([]);
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  if (showScore) {
    return (
      <div className="score-section">
        <h2>Quiz Selesai!</h2>
        <p>Skor Anda: {score} dari {questions.length} pertanyaan.</p>
        <button onClick={resetQuiz}>Coba Lagi</button>
      </div>
    );
  }

  function removeCharacters(question) {
    return question.replace(/(&quot\;)/g, "\"").replace(/(&rsquo\;)/g, "\"").replace(/(&#039\;)/g, "\'").replace(/(&amp\;)/g, "\"");
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="quiz">
      <div className="question-section">
        <div className="question-count">
          <span>Pertanyaan {currentQuestion + 1}</span>/{questions.length}
        </div>
        <div className="question-text">{removeCharacters(currentQ.question)}</div>
        <div className="timer">Waktu tersisa: {timeLeft} detik</div>
      </div>
      <div className="answer-section">
        {shuffledAnswers.map((answer, index) => (
          <button key={index} onClick={() => handleAnswerClick(answer === currentQ.correct_answer)}>
            {removeCharacters(answer)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;



  
  



