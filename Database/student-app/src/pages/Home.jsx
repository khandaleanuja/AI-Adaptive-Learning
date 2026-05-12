import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { db } from "../firebase";

import "./Home.css";

function Home() {
  const [courses, setCourses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const querySnapshot = await getDocs(
      collection(db, "courses")
    );

    const courseList = [];

    querySnapshot.forEach((doc) => {
      courseList.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setCourses(courseList);
  };

  return (
    <div className="home">

      <h1>AI Skill Adaptation System</h1>

      <p>
        Personalized AI Powered Learning Platform
      </p>

      <div className="course-container">

        {courses.map((course) => (
          <div className="course-card" key={course.id}>

            <h2>{course.title}</h2>

            <p>Duration: {course.duration}</p>

            <p>Level: {course.level}</p>

            <button onClick={() => navigate("/register")}>
              Register
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Home;