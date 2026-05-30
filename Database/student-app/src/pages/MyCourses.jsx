import "./MyCourses.css";

import {

  useEffect,
  useState

} from "react";

import {

  doc,
  getDoc,
  collection,
  getDocs

} from "firebase/firestore";

import {

  useNavigate

} from "react-router-dom";

import {

  db

} from "../firebase";

function MyCourses() {

  const [courses, setCourses] =
    useState([]);

  const navigate =
    useNavigate();

  // --------------------------------
  // FETCH REGISTERED COURSES
  // --------------------------------

  const fetchRegisteredCourses =
    async () => {

    try {

      const storedUser =

        JSON.parse(

          localStorage.getItem(
            "user"
          )

        );

      // USER NOT LOGGED IN

      if (!storedUser?.uid) {

        navigate("/login");

        return;
      }

      // GET USER

      const userRef = doc(

        db,
        "users",
        storedUser.uid

      );

      const userSnap =
        await getDoc(userRef);

      if (!userSnap.exists())
        return;

      const userData =
        userSnap.data();

      // USER REGISTERED COURSES

      const registeredCourses =

        userData.registeredCourses || [];

      // GET ALL COURSES

      const querySnapshot =

        await getDocs(

          collection(
            db,
            "courses"
          )

        );

      const courseList = [];

      querySnapshot.forEach(
        (docSnap) => {

          if (

            registeredCourses.includes(
              docSnap.id
            )

          ) {

            courseList.push({

              id: docSnap.id,

              ...docSnap.data(),

            });

          }

        }
      );

      setCourses(courseList);

    }

    catch (error) {

      console.log(error);

    }

  };

  // --------------------------------
  // LOAD COURSES
  // --------------------------------

  useEffect(() => {

    fetchRegisteredCourses();

  }, []);

  // --------------------------------
  // PAGE VOICE SPEAK
  // --------------------------------

  useEffect(() => {

    if (courses.length > 0) {

      const courseNames =

        courses

          .map(
            (course) =>
              course.title
          )

          .join(", ");

      window.speechSynthesis.cancel();

      const speech =

        new SpeechSynthesisUtterance(

          `My courses page loaded. Your registered courses are ${courseNames}. Say see lessons to open lessons.`

        );

      speech.rate = 0.9;

      speech.lang = "en-US";

      window.speechSynthesis.speak(
        speech
      );

    }

  }, [courses]);

  // --------------------------------
  // CONTINUOUS VOICE COMMANDS
  // --------------------------------

  useEffect(() => {

    const SpeechRecognition =

      window.SpeechRecognition ||

      window.webkitSpeechRecognition;

    if (!SpeechRecognition)
      return;

    const recognition =

      new SpeechRecognition();

    recognition.continuous = true;

    recognition.lang = "en-US";

    recognition.interimResults =
      false;

    recognition.start();

    recognition.onresult = (
      event
    ) => {

      recognition.stop();

      const command =

        event.results[
          event.results.length - 1
        ][0].transcript
          .toLowerCase();

      console.log(
        "VOICE COMMAND:",
        command
      );

      // ----------------------
      // SEE LESSONS
      // ----------------------

      if (

        command.includes(
          "see lessons"
        ) ||

        command.includes(
          "open lessons"
        ) ||

        command.includes(
          "start lessons"
        )

      ) {

        if (courses.length > 0) {

          const speech =

            new SpeechSynthesisUtterance(

              "Opening lessons"

            );

          speech.rate = 0.9;

          speech.lang = "en-US";

          window.speechSynthesis.speak(
            speech
          );

          navigate(

            `/student/${courses[0].id}`

          );

          return;

        }

      }

      // ----------------------
      // GO HOME
      // ----------------------

      else if (

        command.includes("home")

      ) {

        navigate("/");

        return;

      }

      // ----------------------
      // LOGOUT
      // ----------------------

      else if (

        command.includes("logout")

      ) {

        localStorage.clear();

        navigate("/login");

        return;

      }

      // RESTART LISTENING

      recognition.start();

    };

    recognition.onerror = (
      event
    ) => {

      console.log(
        event.error
      );

      recognition.start();

    };

    return () => {

      recognition.stop();

    };

  }, [courses, navigate]);

  return (

    <div className="mycourses-container">

      <h1 className="mycourses-title">

        My Courses

      </h1>

      {

        courses.length > 0 ? (

          courses.map((course) => (

            <div

              key={course.id}

              className="course-card"

            >

              <h2 className="course-title">

                {course.title}

              </h2>

              <p className="course-duration">

                {course.duration}

              </p>

              <button

                className="course-button"

                onClick={() =>

                  navigate(

                    `/student/${course.id}`

                  )

                }

              >

                See Lessons

              </button>

            </div>

          ))

        ) : (

          <h3>

            No Registered Courses

          </h3>

        )

      }

    </div>

  );
}

export default MyCourses;