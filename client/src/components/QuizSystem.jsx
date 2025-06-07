import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiClock, FiAward } from 'react-icons/fi';

const QuizSystem = () => {
  const { t } = useTranslation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [showResults, setShowResults] = useState(false);

  // Mock data - replace with API call
  const quiz = {
    title: 'Introduction to Programming Quiz',
    description: 'Test your knowledge of basic programming concepts',
    timeLimit: 600,
    passingScore: 70,
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'What is a variable in programming?',
        options: [
          'A fixed value that cannot be changed',
          'A container for storing data values',
          'A type of loop',
          'A function declaration'
        ],
        correctAnswer: 1,
        explanation: 'A variable is a container for storing data values. It can hold different types of data and its value can be changed during program execution.'
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: 'Which of the following is a valid variable name in most programming languages?',
        options: [
          '123variable',
          '_myVariable',
          '@special',
          '#hash'
        ],
        correctAnswer: 1,
        explanation: 'Variable names can start with an underscore (_) or a letter, but not with a number or special character.'
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: 'What is the purpose of a loop in programming?',
        options: [
          'To store multiple values',
          'To repeat a block of code',
          'To define a function',
          'To declare variables'
        ],
        correctAnswer: 1,
        explanation: 'Loops are used to repeat a block of code multiple times until a certain condition is met.'
      }
    ]
  };

  // Timer effect
  useState(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    quiz.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    return (correctAnswers / quiz.questions.length) * 100;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const QuestionCard = ({ question, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card border-0 shadow-sm mb-4"
    >
      <div className="card-body">
        <h5 className="mb-4">
          {t('Question')} {index + 1}: {question.question}
        </h5>
        <div className="d-flex flex-column gap-3">
          {question.options.map((option, optionIndex) => (
            <div
              key={optionIndex}
              className={`p-3 border rounded cursor-pointer ${
                selectedAnswers[question.id] === optionIndex
                  ? 'border-primary bg-light'
                  : 'border-light'
              }`}
              onClick={() => handleAnswerSelect(question.id, optionIndex)}
            >
              <div className="d-flex align-items-center">
                <div className="me-3">
                  {selectedAnswers[question.id] === optionIndex ? (
                    <FiCheck className="text-primary" />
                  ) : (
                    <div className="border rounded-circle" style={{ width: 20, height: 20 }} />
                  )}
                </div>
                <span>{option}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const ResultsCard = () => {
    const score = calculateScore();
    const passed = score >= quiz.passingScore;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card border-0 shadow-sm"
      >
        <div className="card-body text-center p-5">
          <div className="display-1 mb-4">
            {passed ? '🎉' : '😔'}
          </div>
          <h2 className="mb-4">
            {passed ? t('Congratulations!') : t('Keep Learning!')}
          </h2>
          <div className="display-4 mb-4">
            {score.toFixed(1)}%
          </div>
          <p className="text-muted mb-4">
            {passed
              ? t('You have passed the quiz!')
              : t('You need to score at least')} {quiz.passingScore}% {t('to pass')}
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-primary">
              {t('Review Answers')}
            </button>
            <button className="btn btn-outline-primary">
              {t('Try Again')}
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="container py-4">
      {/* Quiz Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{quiz.title}</h2>
          <p className="text-muted mb-0">{quiz.description}</p>
        </div>
        <div className="d-flex align-items-center">
          <div className="me-4">
            <FiClock className="me-2" />
            {formatTime(timeLeft)}
          </div>
          <div>
            <FiAward className="me-2" />
            {t('Passing Score')}: {quiz.passingScore}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress mb-4" style={{ height: 6 }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{
            width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`
          }}
        />
      </div>

      {/* Questions */}
      {!showResults ? (
        <>
          <QuestionCard
            question={quiz.questions[currentQuestion]}
            index={currentQuestion}
          />
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-outline-primary"
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion(prev => prev - 1)}
            >
              {t('Previous')}
            </button>
            {currentQuestion < quiz.questions.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={() => setCurrentQuestion(prev => prev + 1)}
              >
                {t('Next')}
              </button>
            ) : (
              <button
                className="btn btn-success"
                onClick={handleSubmit}
              >
                {t('Submit Quiz')}
              </button>
            )}
          </div>
        </>
      ) : (
        <ResultsCard />
      )}
    </div>
  );
};

export default QuizSystem; 