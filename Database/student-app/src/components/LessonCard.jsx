// import {
//   doc,
//   deleteDoc
// } from "firebase/firestore";

// import { db } from "../firebase";

// import EditLesson from "./EditLesson";

// function LessonCard({ lesson, role }) {

//   const deleteLesson = async () => {

//     try {

//       await deleteDoc(
//         doc(db, "lessons", lesson.id)
//       );

//       alert("Lesson Deleted");

//       window.location.reload();

//     }

//     catch (error) {

//       alert(error.message);

//     }
//   };

//   const speakLesson = () => {

//     const speech =
//       new SpeechSynthesisUtterance(
//         lesson.simpleText
//       );

//     speechSynthesis.speak(speech);
//   };

//   return (

//     <div className="lesson-card">

//       <h2>{lesson.title}</h2>

//       <p>{lesson.simpleText}</p>

//       <div className="card-buttons">

//         <button
//           className="listen-btn"
//           onClick={speakLesson}
//         >

//           🔊 Listen

//         </button>


//       </div>

//     </div>

//   );
// }

// export default LessonCard;





import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment
} from "firebase/firestore";

import {
  useEffect,
  useState
} from "react";

import { db } from "../firebase";

function LessonCard({ lesson }) {

  const [watchCount, setWatchCount]
    = useState(0);

  const [difficulty, setDifficulty]
    = useState(
      lesson.difficultyLevel || 1
    );

  const [mode, setMode]
    = useState("Standard");

  const [score, setScore]
    = useState(0);

  // ------------------------------------
  // LOAD EXISTING PROGRESS
  // ------------------------------------

  useEffect(() => {

    loadProgress();

  }, []);

  const loadProgress = async () => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user?.uid) return;

    const progressId =
      `${user.uid}_${lesson.id}`;

    const progressRef = doc(
      db,
      "progress",
      progressId
    );

    const progressSnap =
      await getDoc(progressRef);

    if (progressSnap.exists()) {

      const data =
        progressSnap.data();

      setWatchCount(
        data.watchCount || 0
      );

      setDifficulty(
        data.difficultyLevel || 1
      );

      setMode(
        data.mode || "Standard"
      );

      setScore(
        data.score || 0
      );
    }
  };

  // ------------------------------------
  // SPEAK LESSON
  // ------------------------------------

  const speakLesson = async () => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user?.uid) return;

    const progressId =
      `${user.uid}_${lesson.id}`;

    const progressRef = doc(
      db,
      "progress",
      progressId
    );

    // UPDATE WATCH COUNT

    await setDoc(
      progressRef,
      {
        userId: user.uid,
        lessonId: lesson.id,
        watchCount: increment(1)
      },
      { merge: true }
    );

    // GET UPDATED DATA

    const updatedSnap =
      await getDoc(progressRef);

    const updatedData =
      updatedSnap.data();

    const newWatchCount =
      updatedData.watchCount;

    setWatchCount(newWatchCount);

    // ------------------------------------
    // AI ADAPTATION
    // ------------------------------------

    let updatedMode =
      "Standard";

    let updatedDifficulty =
      difficulty;

    // WATCHED MANY TIMES

    if (newWatchCount >= 3) {

      updatedMode =
        "Simplified";

      updatedDifficulty = 1;
    }

    setMode(updatedMode);

    setDifficulty(
      updatedDifficulty
    );

    // SAVE AI STATE

    await updateDoc(
      progressRef,
      {
        mode: updatedMode,
        difficultyLevel:
          updatedDifficulty
      }
    );

    // SPEAK CONTENT

    const speech =
      new SpeechSynthesisUtterance(

        updatedMode === "Simplified"

          ? lesson.simpleText

          : lesson.standardText

      );

    speechSynthesis.speak(speech);
  };

  // ------------------------------------
  // START LESSON
  // ------------------------------------

  const startQuiz = async () => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user?.uid) return;

    const progressId =
      `${user.uid}_${lesson.id}`;

    const progressRef = doc(
      db,
      "progress",
      progressId
    );

    // RANDOM SCORE

    const generatedScore =
      Math.floor(
        Math.random() * 100
      );

    setScore(generatedScore);

    let updatedDifficulty =
      difficulty;

    let updatedMode = mode;

    // HIGH SCORE

    if (generatedScore >= 80) {

      updatedDifficulty =
        difficulty + 1;

      updatedMode = "Hard";
    }

    // LOW SCORE

    else if (
      generatedScore < 40
    ) {

      updatedDifficulty = 1;

      updatedMode =
        "Simplified";
    }

    setDifficulty(
      updatedDifficulty
    );

    setMode(updatedMode);

    // SAVE PROGRESS

    await setDoc(
      progressRef,
      {
        userId: user.uid,
        lessonId: lesson.id,
        score: generatedScore,
        difficultyLevel:
          updatedDifficulty,
        mode: updatedMode
      },
      { merge: true }
    );

    // UPDATE USER LEVEL

    const userRef = doc(
      db,
      "users",
      user.uid
    );

    await updateDoc(
      userRef,
      {
        adaptiveLevel:
          `Level ${updatedDifficulty}`
      }
    );

    alert(
      `Score: ${generatedScore}`
    );
  };

  return (

    <div className="lesson-card">

      <h2>{lesson.title}</h2>

      <p>

        {

          mode === "Simplified"

            ? lesson.simpleText

            : lesson.standardText

        }

      </p>

      {/* AI DATA */}

      <div>

        <p>
          Watch Count:
          {" "}
          {watchCount}
        </p>

        <p>
          Difficulty:
          {" "}
          {difficulty}
        </p>

        <p>
          Mode:
          {" "}
          {mode}
        </p>

        <p>
          Score:
          {" "}
          {score}
        </p>

      </div>

      {/* BUTTONS */}

      <button
        onClick={speakLesson}
      >

        🔊 Listen

      </button>

      <button
        onClick={startQuiz}
      >

        Start Quiz

      </button>

    </div>
  );
}

export default LessonCard;