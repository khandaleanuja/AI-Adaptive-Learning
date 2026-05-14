import "./MyCourses.css";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegisteredCourses();
  }, []);

  const fetchRegisteredCourses = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser?.uid) {
        navigate("/login");
        return;
      }

      const userRef = doc(db, "users", storedUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) return;

      const userData = userSnap.data();
      const registeredCourses = userData.registeredCourses || [];

      const querySnapshot = await getDocs(collection(db, "courses"));

      const courseList = [];

      querySnapshot.forEach((docSnap) => {
        if (registeredCourses.includes(docSnap.id)) {
          courseList.push({
            id: docSnap.id,
            ...docSnap.data(),
          });
        }
      });

      setCourses(courseList);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mycourses-container">

      <h1 className="mycourses-title">
        My Courses
      </h1>

      {courses.map((course) => (
        <div key={course.id} className="course-card">

          <h2 className="course-title">
            {course.title}
          </h2>

          <p className="course-duration">
            {course.duration}
          </p>

          <button
            className="course-button"
            onClick={() =>
              navigate(`/student/${course.id}`)
            }
          >
            See Lessons
          </button>

        </div>
      ))}

    </div>
  );
}

export default MyCourses;