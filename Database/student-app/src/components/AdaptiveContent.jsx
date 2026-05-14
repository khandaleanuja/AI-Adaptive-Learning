import React from "react";

function AdaptiveContent({ lesson }) {

  // SAMPLE AI CONDITIONS
  // Later these can come from backend/user progress

  const score = 90;
  const responseTime = 5;

  // ADAPTIVE LOGIC

  const showSimple =
    score < 40 || responseTime > 15;

  // SELECT CONTENT

  const content = showSimple
    ? lesson.simpleText
    : lesson.standardText;

  // TEXT TO SPEECH FUNCTION

  const speakText = () => {

    const speech = new SpeechSynthesisUtterance(content);

    speech.rate = 1;

    speech.pitch = 1;

    speech.volume = 1;

    speechSynthesis.speak(speech);
  };

  return (

    <div
      style={{
        border: "1px solid gray",
        padding: "15px",
        marginTop: "10px"
      }}
    >

      {/* TITLE */}

      <h2>{lesson.title}</h2>

      {/* CATEGORY */}

      <p>

        <strong>Category:</strong>
        {" "}
        {lesson.category}

      </p>

      {/* ADAPTIVE MODE */}

      <p>

        <strong>Mode:</strong>
        {" "}

        {
          showSimple
            ? "Simplified Content"
            : "Standard Content"
        }

      </p>

      {/* CONTENT */}

      <p>{content}</p>

      {/* TEXT TO SPEECH BUTTON */}

      <button onClick={speakText}>

        🔊 Read Aloud

      </button>

    </div>
  );
}

export default AdaptiveContent;