import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

import { db } from "../../firebase";
import LessonCard from "./LessonCard";

function LessonList({ role, courseId, search, category }) {
  const [lessons, setLessons] = useState([]);
  const [allLessons, setAllLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [isListening, setIsListening] = useState(false); // ✅ FIX ADDED
  const navigate = useNavigate();

  const recognitionRef = useRef(null);
  const lessonsRef = useRef([]);
  const currentIndexRef = useRef(0);

  // sync lessons
  useEffect(() => {
    lessonsRef.current = lessons;
  }, [lessons]);

  // fetch
  useEffect(() => {
    if (courseId) fetchLessons();
  }, [courseId]);

  // filter
  useEffect(() => {
    filterLessons();
  }, [search, category, allLessons]);

  const fetchLessons = async () => {
    try {
      const q = query(
        collection(db, "lessons"),
        where("courseId", "==", courseId)
      );

      const snapshot = await getDocs(q);

      const list = [];
      snapshot.forEach((docSnap) => {
        list.push({
          id: docSnap.id,
          ...docSnap.data()
        });
      });

      setAllLessons(list);
      setLessons(list);
    } catch (err) {
      console.log(err);
    }
  };

  const filterLessons = () => {
    let filtered = [...allLessons];

    if (search) {
      filtered = filtered.filter((l) =>
        l.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter((l) => l.category === category);
    }

    setLessons(filtered);
  };

  const cleanText = (text) =>
    text.toLowerCase().replace(/[^a-z0-9 ]/g, "");

  // ---------------- SPEAK ----------------
  const speak = (text) => {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.9;
    speech.lang = "en-US";

    speech.onstart = () => {
      recognitionRef.current?.stop();
      setIsListening(false); // ✅ FIX
    };

    speech.onend = () => {
      setTimeout(() => {
        try {
          recognitionRef.current?.start();
          setIsListening(true); // ✅ FIX
        } catch (e) {}
      }, 800);
    };

    window.speechSynthesis.speak(speech);
  };

  // ---------------- PLAY LESSON ----------------
  const playLesson = (index) => {
    const list = lessonsRef.current;
    if (!list[index]) return;

    currentIndexRef.current = index;
    setCurrentLesson(list[index]);

    speak(list[index].content || list[index].simpleText);
  };

  // ---------------- VOICE ENGINE ----------------
  useEffect(() => {
    if (lessons.length === 0) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    setTimeout(() => {
      try {
        recognition.start();
        console.log("Voice System Started");
        setIsListening(true); // ✅ FIX
      } catch (e) {}
    }, 1000);

    recognition.onresult = (event) => {
      const command =
        event.results[event.results.length - 1][0].transcript
          .toLowerCase()
          .trim();

      console.log("VOICE:", command);

      recognition.stop();
      setIsListening(false); // ✅ FIX

      // START
      if (command.includes("start lesson")) {
        return;
      }

      // STOP
      if (command.includes("stop lesson")) {
        window.speechSynthesis.cancel();
        return;
      }

      // REPEAT
      if (command.includes("repeat this lesson")) {
        if (currentLesson) {
          speak(currentLesson.content || currentLesson.simpleText);
        }
        return;
      }

      // NEXT
      if (command.includes("next")) {
        playLesson(currentIndexRef.current + 1);
        return;
      }


      // START QUIZ
if (
  command.includes("start quiz") ||
  command.includes("go to quiz") ||
  command.includes("open quiz") ||
  command.includes("quiz page")
) {

  if (currentLesson) {

    speak("Opening quiz page");

    setTimeout(() => {

      window.location.href =
        `/quiz/${currentLesson.id}`;

    }, 1500);

  } else {

    speak(
      "Please start a lesson first"
    );

  }

  return;
}

      // LISTEN
      if (command.includes("listen")) {
        const courseName = command.replace("listen", "").trim();
        const cleanCommand = cleanText(courseName);

        const matched = lessonsRef.current.find((l) => {
          const title = cleanText(l.title || "");
          return title.includes(cleanCommand);
        });

        console.log("Matched Lesson:", matched);

        if (matched) {
          const index = lessonsRef.current.findIndex(
            (l) => l.id === matched.id
          );

          currentIndexRef.current = index;
          setCurrentLesson(matched);

          setTimeout(() => {
            playLesson(index);
          }, 500);
        }

        return;
      }

      setTimeout(() => {
        try {
          recognition.start();
          setIsListening(true); // ✅ FIX
        } catch (e) {}
      }, 800);
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted") return;
      console.log("VOICE ERROR:", event.error);
    };

    return () => {
      recognition.stop();
      window.speechSynthesis.cancel();
    };
  }, [lessons, currentLesson]);

  return (
    <div>
      {/* ✅ LISTEN STATUS BUTTON (FIXED UI CONNECTION) */}
      <div style={{ marginBottom: "10px" }}>
        <button
          style={{
            padding: "8px 12px",
            background: isListening ? "green" : "red",
            color: "white",
            border: "none",
            borderRadius: "6px"
          }}
        >
          {isListening ? "Listening ON 🎤" : "Listening OFF 🔇"}
        </button>
      </div>

      {lessons.length > 0 ? (
        lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            role={role}
            isActive={currentLesson?.id === lesson.id} // ✅ optional highlight
          />
        ))
      ) : (
        <h3>No Lessons Found</h3>
      )}
    </div>
  );
}

export default LessonList;