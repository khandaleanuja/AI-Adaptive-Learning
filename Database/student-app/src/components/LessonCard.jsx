import {
  doc,
  deleteDoc
} from "firebase/firestore";

import { db } from "../firebase";

import EditLesson from "./EditLesson";

function LessonCard({ lesson, role }) {

  const deleteLesson = async () => {

    try {

      await deleteDoc(
        doc(db, "lessons", lesson.id)
      );

      alert("Lesson Deleted");

      window.location.reload();

    }

    catch (error) {

      alert(error.message);

    }
  };

  const speakLesson = () => {

    const speech =
      new SpeechSynthesisUtterance(
        lesson.simpleText
      );

    speechSynthesis.speak(speech);
  };

  return (

    <div className="lesson-card">

      <h2>{lesson.title}</h2>

      <p>{lesson.simpleText}</p>

      <div className="card-buttons">

        <button
          className="listen-btn"
          onClick={speakLesson}
        >

          🔊 Listen

        </button>


      </div>

    </div>

  );
}

export default LessonCard;