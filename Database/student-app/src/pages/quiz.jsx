import { useState, useEffect } from "react";
import "./Quiz.css";

function Quiz() {

  const questions = [
    {
      question: "Java is?",
      options: ["Language", "Animal", "Food"],
      answer: "Language"
    },
    {
      question: "React is?",
      options: ["Library", "Database", "OS"],
      answer: "Library"
    },
    {
      question: "HTML stands for?",
      options: [
        "Hyper Text Markup Language",
        "High Transfer Machine Language",
        "Home Tool Markup Language"
      ],
      answer: "Hyper Text Markup Language"
    }
  ];

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [score, setScore] =
    useState(0);

  const [showResult, setShowResult] =
    useState(false);

  // Speak Question + Options
  useEffect(() => {

    if (showResult) return;

    const text = `
      Question ${currentQuestion + 1}.
      ${questions[currentQuestion].question}

      Option 1:
      ${questions[currentQuestion].options[0]}

      Option 2:
      ${questions[currentQuestion].options[1]}

      Option 3:
      ${questions[currentQuestion].options[2]}

      Please say your answer.
    `;

    speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(text);

    speech.rate = 1;

    speechSynthesis.speak(speech);

  }, [currentQuestion, showResult]);

  // Voice Recognition
  useEffect(() => {

    if (showResult) return;

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition =
      new SpeechRecognition();

    recognition.continuous = true;

    recognition.lang = "en-US";

    recognition.onresult = (event) => {

      const command =
        event.results[
          event.results.length - 1
        ][0].transcript
          .toLowerCase();

      console.log("Voice:", command);

      const options =
        questions[currentQuestion].options;

      if (command.includes("option 1")) {

        handleAnswer(options[0]);
      }

      else if (
        command.includes("option 2")
      ) {

        handleAnswer(options[1]);
      }

      else if (
        command.includes("option 3")
      ) {

        handleAnswer(options[2]);
      }

      else {

        options.forEach(option => {

          if (
            command.includes(
              option.toLowerCase()
            )
          ) {

            handleAnswer(option);
          }

        });

      }
    };

    recognition.start();

    return () => {

      recognition.stop();
    };

  }, [currentQuestion, showResult]);

  const handleAnswer = (selected) => {

    let updatedScore = score;

    if (
      selected ===
      questions[currentQuestion].answer
    ) {

      updatedScore += 1;

      setScore(updatedScore);
    }

    const next =
      currentQuestion + 1;

    if (
      next < questions.length
    ) {

      setCurrentQuestion(next);
    }

    else {

      setShowResult(true);

      const percentage =
        Math.round(
          (updatedScore /
            questions.length) * 100
        );

      const speech =
        new SpeechSynthesisUtterance(
          `Quiz completed.
           Your score is
           ${updatedScore}
           out of
           ${questions.length}.
           Your percentage is
           ${percentage} percent.`
        );

      speechSynthesis.speak(speech);
    }
  };

  if (showResult) {

    const percentage =
      Math.round(
        (score / questions.length) * 100
      );

    return (

      <div className="quiz-container">

        <div className="result-card">

          <h1>
            🎉 Quiz Completed
          </h1>

          <h2>
            Score:
            {" "}
            {score}
            {" / "}
            {questions.length}
          </h2>

          <p>
            Percentage:
            {" "}
            {percentage}%
          </p>

          <button
            className="option-btn"
            onClick={() => {

              setCurrentQuestion(0);
              setScore(0);
              setShowResult(false);

            }}
          >
            Restart Quiz
          </button>

        </div>

      </div>
    );
  }

  return (

    <div className="quiz-container">

      <div className="quiz-card">

        <h3>
          Question
          {" "}
          {currentQuestion + 1}
          {" / "}
          {questions.length}
        </h3>

        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{
              width: `${
                ((currentQuestion + 1)
                  / questions.length)
                * 100
              }%`
            }}
          />

        </div>

        <h2 className="question">

          {
            questions[
              currentQuestion
            ].question
          }

        </h2>

        <div className="options">

          {
            questions[
              currentQuestion
            ].options.map(
              option => (

                <button
                  key={option}
                  className="option-btn"
                  onClick={() =>
                    handleAnswer(option)
                  }
                >
                  {option}
                </button>

              )
            )
          }

        </div>

        <p
          style={{
            marginTop: "20px"
          }}
        >
          🎤 Voice Commands:
          Option 1, Option 2,
          Option 3
        </p>

      </div>

    </div>
  );
}

export default Quiz;