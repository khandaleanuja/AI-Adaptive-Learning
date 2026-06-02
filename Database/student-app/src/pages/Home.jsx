import { useEffect, useState, useRef } from "react";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";

import { db } from "../firebase";

import "./Home.css";

function Home() {

  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  const [showVoicePopup, setShowVoicePopup] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [assistantText, setAssistantText] = useState("");
const [showTextBox, setShowTextBox] = useState(false);

  const recognitionRef = useRef(null);

  const navigate = useNavigate();

  // ---------------- LOAD DATA ----------------
  useEffect(() => {

    fetchCourses();
    const voiceChoice =
            localStorage.getItem("voiceChoice");

            if (voiceChoice === "enabled") {

              setIsVoiceEnabled(true);

              setTimeout(() => {
                startVoiceAssistant();
              }, 1000);

            }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(
      "Welcome to adaptive learning page. " + 
      "please login to start your course if you have no account then please register. "
    );

    speech.rate = 0.9;
    speech.lang = "en-US";

  speech.onend = () => {

  const voiceChoice =
    localStorage.getItem("voiceChoice");

  // Agar pehle choose kar chuka hai toh popup mat dikha
  if (voiceChoice) return;

  setTimeout(() => {

    setShowVoicePopup(true);

    const popupMsg =
      "Press 1 to enable voice assistant. Press 2 to disable voice assistant.";

    const utter =
      new SpeechSynthesisUtterance(
        popupMsg
      );

    window.speechSynthesis.speak(
      utter
    );

  }, 8000); // 8 seconds baad popup

};
    window.speechSynthesis.speak(speech);

    const storedUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (storedUser?.uid) {
      setUser(storedUser);
      fetchUserData(storedUser.uid);
    }

  }, []);

  // ---------------- VOICE POPUP ACTION ----------------
  const enableVoice = () => {

  localStorage.setItem(
    "voiceChoice",
    "enabled"
  );

  setShowVoicePopup(false);

  setIsVoiceEnabled(true);

  startVoiceAssistant();

};
 const disableVoice = () => {

  localStorage.setItem(
    "voiceChoice",
    "disabled"
  );

  setShowVoicePopup(false);

  setIsVoiceEnabled(false);

};

  // ---------------- VOICE ASSISTANT ----------------
  const startVoiceAssistant = () => {

    if (recognitionRef.current) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {

      const command =
        event.results[event.results.length - 1][0].transcript.toLowerCase();

      console.log("VOICE COMMAND:", command);

      if (
        command.includes("my course") ||
        command.includes("mycourses") ||
        command.includes("my courses")
      ) {
        navigate("/mycourses");
      }

      if (command.includes("login")) {
        navigate("/login");
      }
      if (command.includes("about")){
        navigate("/about")
      }
      if (
  command.includes("register") ||
  command.includes("registration") ||
  command.includes("register page") ||
  command.includes("go to register") ||
  command.includes("go to register page")
) {

  const speech =
    new SpeechSynthesisUtterance(
      "Opening register page"
    );

  window.speechSynthesis.speak(speech);

  navigate("/register");
}

      if (command.includes("logout")) {
        logoutUser();
      }
            if (
        command.includes("home") ||
        command.includes("homepage") ||
        command.includes("go home")
      ) {
        navigate("/");
      }

    if (
  command.includes("quiz") ||
  command.includes("start quiz") ||
  command.includes("open quiz") ||
  command.includes("go to quiz")
) {

  const speech =
    new SpeechSynthesisUtterance(
      "Opening quiz page"
    );

  window.speechSynthesis.speak(
    speech
  );

  navigate(`/quiz/${courseId}/${lessonId}`);
  console.log(courseId);
}
      if (
  command.includes("enable voice")
) {
  enableVoice();
}

if (
  command.includes("disable voice")
) {
  disableVoice();
}



    };

    recognition.onend = () => {
      if (isVoiceEnabled) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // ---------------- FETCH COURSES ----------------
  const fetchCourses = async () => {

    try {

      const querySnapshot = await getDocs(
        collection(db, "courses")
      );

      const courseList = [];

      querySnapshot.forEach((docSnap) => {
        courseList.push({
          id: docSnap.id,
          ...docSnap.data()
        });
      });

      setCourses(courseList);

    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- FETCH USER ----------------
  const fetchUserData = async (uid) => {

    try {

      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }

    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- REGISTER COURSE ----------------
  const registerCourse = async (courseId) => {

    try {

      const storedUser = JSON.parse(
        localStorage.getItem("user")
      );

      if (!storedUser?.uid) {
        navigate("/login");
        return;
      }

      const userRef = doc(db, "users", storedUser.uid);

      await updateDoc(userRef, {
        registeredCourses: arrayUnion(courseId)
      });

      await fetchUserData(storedUser.uid);

      alert("Course Registered Successfully");

    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- LOGOUT ----------------
  const logoutUser = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("voiceChoice");

    setUser(null);
    setUserData(null);

    navigate("/");
  };

  return (

    <div className="home">

      {/* 🔥 VOICE POPUP */}
      {showVoicePopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999
        }}>

          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            textAlign: "center"
          }}>

            <p>Press 1  Enable the voice assistant </p>
            <p>Press 2  Disable  the voice assistant </p>

            <button onClick={enableVoice}>1 </button>
            <button onClick={disableVoice}>2 </button>

          </div>
        </div>
      )}

      {/* NAVBAR */}
      <div className="navbar">

        <h2 className="logo">Adaptive Learn</h2>

        <div className="nav-buttons">

          {user ? (
            <>
              <button onClick={() => navigate("/mycourses")}>
                My Courses
              </button>

              <button onClick={logoutUser}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")}>
                Login
              </button>

              <button onClick={() => navigate("/register")}>
                Register
              </button>
            </>
          )}

        </div>
      </div>

      {/* HERO */}
      <div className="hero-section">
      <div className="hero-content">
         <span className="hero-badge">
            AI Powered Learning Platform
          </span>

          <h1>
            Learn Smarter With <br />
            <span> Artificial Intelligence</span>
          </h1>

          <p>
            Personalized learning experience with AI-driven
            recommendations, voice assistance and adaptive
            course pathways.
          </p>

            <div className="hero-buttons">
                  <button onClick={() => navigate("/register")}>
                    Get Started
                  </button>

                        <button className="secondary-btn" onClick={() => navigate("/about")} >
                             Learn More
                        </button>
              </div>

          </div>
      </div>

      {/* COURSES */}
      <h2 className="course-heading">Available Courses</h2>

      <div className="course-container">

        {courses.map((course) => {

          const registeredCourses =
            userData?.registeredCourses || [];

          const isRegistered =
            registeredCourses.includes(course.id);

          return (

            <div className="course-card" key={course.id}>

              <h2>{course.title}</h2>

              <p><b>Duration:</b> {course.duration}</p>
              <p><b>Level:</b> {course.level}</p>

              {user ? (

                isRegistered ? (
                  <button onClick={() =>
                    navigate(`/student/${course.id}`)
                  }>
                    See Lessons
                  </button>
                ) : (
                  <button onClick={() => registerCourse(course.id)}>
                    Register Course
                  </button>
                )

              ) : (
                <button onClick={() => navigate("/register")}>
                  Register to Access
                </button>
              )}

            </div>

          );

        })}

      </div>

    </div>
  );
}

export default Home;