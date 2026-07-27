import {
  useEffect,
  useState
} from "react";

import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";

import {
  useNavigate
} from "react-router-dom";

import { db } from "../../firebase";
import "./AdminPage.css";

function AdminPage() {

  const [courses, setCourses]
    = useState([]);

  const navigate = useNavigate();

  // ---------------- FETCH COURSES ----------------
  useEffect(() => {

    fetchCourses();

  }, []);

  const fetchCourses = async () => {

    try {

      const querySnapshot =
        await getDocs(
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

  // ---------------- DELETE COURSE ----------------
  const deleteCourse = async (courseId) => {

    try {

      await deleteDoc(
        doc(db, "courses", courseId)
      );

      fetchCourses();

      alert("Course Deleted");

    }

    catch (error) {

      console.log(error);

    }
  };

  // ---------------- LOGOUT ----------------
  const logoutUser = () => {

    localStorage.removeItem("user");

    navigate("/");

  };

  return (

    <div className="admin-dashboard">

      {/* NAVBAR */}

      <div className="navbar">

        <h2 className="logo">

          Admin Panel

        </h2>

        <div className="nav-buttons">

          <div className="dropdown">

              <button className="login-btn">
                Manage lessons
              </button>

              <div className="dropdown-content">

                <button
                  onClick={() =>
                    navigate("/add-lesson")
                  }
                >
                  Add lessons
                </button>

                <button
                  onClick={() =>
                    navigate("/manage-lessons")
                  }
                >
                  Update / Delete lessons
                </button>

              </div>

          </div>

          <button
            className="logout-btn"
            onClick={logoutUser}
          >
            Logout
          </button>

        </div>

      </div>

      {/* HERO */}

      <div className="hero-section">

        <h1>
          Admin Dashboard
        </h1>

        <p>
          Manage courses and lessons
        </p>

      </div>

      {/* COURSES */}

      <h2 className="course-heading">

        Available Courses

      </h2>

      <div className="course-container">

        {

          courses.map((course) => (

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

              {/* SEE LESSONS */}

              <button
                  className="start-btn"
                  onClick={() =>
                    navigate(`/admin/course/${course.id}`)
                  }
                >
                  See Lessons
              </button>

            </div>

          ))

        }

      </div>

    </div>
  );
}

export default AdminPage;