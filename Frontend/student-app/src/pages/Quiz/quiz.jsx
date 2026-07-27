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

  
  const [finalScore, setFinalScore] =
  useState(0);

  const [finalPercentage, setFinalPercentage] =
  useState(0);

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

      let totalScore = updatedScore;

        const percentage =
          Math.round(
            (totalScore / questions.length) * 100
          );

        setFinalScore(totalScore);

        setFinalPercentage(percentage);

      setShowResult(true);

      const speech =
        new SpeechSynthesisUtterance(
          `Quiz completed.
           Your score is
           ${totalScore}
           out of
           ${questions.length}.
           Your percentage is
           ${percentage} percent.`
        );

      speechSynthesis.speak(speech);
    }
  };


      const saveScore = async () => {

      const percentage = finalPercentage;

      const payload = {

        userId:
          localStorage.getItem("userId"),

        lessonId: "lesson1",

        score: finalScore,
        
        percentage: Math.round(
        (finalScore / questions.length) * 100
      ),


        responseTime: 4,

        videoWatchCount: 1

      };

      console.log("Sending:", payload);

      try {

        const response = await fetch(
          "http://localhost:5000/progress/save",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify(payload)
          }
        );

        const data =
          await response.json();

        console.log(data);

        alert(
          "Score saved successfully!"
        );

      } catch(error) {

        console.log(error);

        alert(
          "Error saving score"
        );
      }
    };




  if (showResult) {

    const percentage =
      Math.round(
        (finalScore / questions.length) * 100
      );

    return (

      <div className="quiz-container">

        <div className="result-card">

          <h1>
            🎉 Quiz Completed
          </h1>

          <h2>
            Score : {finalPercentage}
          </h2>

          <h2>
            Correct Answers : {finalScore} / {questions.length}
          </h2>

          <button
            className="option-btn"
            onClick={saveScore}
          >
            Save Score
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