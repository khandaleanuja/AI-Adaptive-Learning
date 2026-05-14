import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";

import { db } from "../firebase";

import { useNavigate } from "react-router-dom";

function AdminCourseList() {

  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  // ---------------- FETCH COURSES ----------------
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {

      const querySnapshot =
        await getDocs(collection(db, "courses"));

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

  // ---------------- DELETE COURSE ----------------
  const deleteCourse = async (id) => {
    try {

      await deleteDoc(doc(db, "courses", id));

      fetchCourses();

      alert("Course Deleted");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>

      {courses.length > 0 ? (
        courses.map((course) => (

          <div
            key={course.id}
            className="course-card"
          >

            <h2>{course.title}</h2>

            <p>
              Duration: {course.duration}
            </p>

            <p>
              Level: {course.level}
            </p>

            {/* SEE LESSONS */}
            <button
              onClick={() =>
                navigate(`/admin/course/${course.id}`)
              }
            >
              See Lessons
            </button>

            {/* DELETE COURSE */}
            <button
              onClick={() =>
                deleteCourse(course.id)
              }
            >
              Delete
            </button>

          </div>

        ))
      ) : (
        <h3>No Courses Found</h3>
      )}

    </div>
  );
}

export default AdminCourseList;