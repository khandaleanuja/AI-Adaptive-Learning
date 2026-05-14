import { useEffect, useState } from "react";

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

  const navigate = useNavigate();

  // ---------------- LOAD DATA ----------------
  useEffect(() => {

    fetchCourses();

    const storedUser = JSON.parse(
      localStorage.getItem("user")
    );

    console.log(
      "LOCAL USER:",
      storedUser
    );

    if (storedUser?.uid) {

      setUser(storedUser);

      fetchUserData(storedUser.uid);

    }

  }, []);

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

    }

    catch (error) {

      console.log(error);

    }
  };

  // ---------------- FETCH USER ----------------
  const fetchUserData = async (uid) => {

    try {

      const userRef = doc(
        db,
        "users",
        uid
      );

      const userSnap =
        await getDoc(userRef);

      if (userSnap.exists()) {

        const data =
          userSnap.data();

        console.log(
          "FIRESTORE USER:",
          data
        );

        setUserData(data);

      }

    }

    catch (error) {

      console.log(error);

    }
  };

  // ---------------- REGISTER COURSE ----------------
  const registerCourse = async (courseId) => {

    try {

      const storedUser = JSON.parse(
        localStorage.getItem("user")
      );

      // USER NOT LOGGED IN
      if (!storedUser?.uid) {

        navigate("/login");

        return;
      }

      const userRef = doc(
        db,
        "users",
        storedUser.uid
      );

      // ADD COURSE
      await updateDoc(userRef, {

        registeredCourses:
          arrayUnion(courseId)

      });

      // REFRESH USER DATA
      await fetchUserData(
        storedUser.uid
      );

      alert(
        "Course Registered Successfully"
      );

    }

    catch (error) {

      console.log(error);

    }
  };

  // ---------------- LOGOUT ----------------
  const logoutUser = () => {

    localStorage.removeItem("user");

    setUser(null);

    setUserData(null);

    navigate("/");
  };

  return (

    <div className="home">

      {/* NAVBAR */}
      <div className="navbar">

        <h2 className="logo">
          Adaptive Learn
        </h2>

        <div className="nav-buttons">

          {user ? (

            <>

              <button
                className="login-btn"
                onClick={() =>
                  navigate("/mycourses")
                }
              >
                My Courses
              </button>

              <button
                className="logout-btn"
                onClick={logoutUser}
              >
                Logout
              </button>

            </>

          ) : (

            <>

              <button
                className="login-btn"
                onClick={() =>
                  navigate("/login")
                }
              >
                Login
              </button>

              <button
                className="register-btn"
                onClick={() =>
                  navigate("/register")
                }
              >
                Register
              </button>

            </>

          )}

        </div>
      </div>

      {/* HERO */}
      <div className="hero-section">

        <h1>
          AI Skill Adaptation System
        </h1>

        <p>
          Personalized AI Powered Learning
          Platform for Differently-Abled
          Learners
        </p>

      </div>

      {/* COURSES */}
      <h2 className="course-heading">

        Available Courses

      </h2>

      <div className="course-container">

        {courses.map((course) => {

          // REGISTERED COURSES
          const registeredCourses =
            userData?.registeredCourses || [];

          // CHECK CURRENT COURSE
          const isRegistered =
            registeredCourses.includes(
              course.id
            );

          console.log(
            "COURSE:",
            course.id,
            "REGISTERED:",
            registeredCourses
          );

          return (

            <div
              className="course-card"
              key={course.id}
            >

              <h2>
                {course.title}
              </h2>

              <p>
                <strong>
                  Duration:
                </strong>{" "}
                {course.duration}
              </p>

              <p>
                <strong>
                  Level:
                </strong>{" "}
                {course.level}
              </p>

              {/* BUTTON LOGIC */}

              {user ? (

                isRegistered ? (

                  <button
                    className="start-btn"
                    onClick={() =>
                      navigate(
                        `/student/${course.id}`
                      )
                    }
                  >
                    See Lessons
                  </button>

                ) : (

                  <button
                    className="register-course-btn"
                    onClick={async () => {

                      await registerCourse(
                        course.id
                      );

                    }}
                  >
                    Register Course
                  </button>

                )

              ) : (

                <button
                  className="register-course-btn"
                  onClick={() =>
                    navigate("/register")
                  }
                >
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