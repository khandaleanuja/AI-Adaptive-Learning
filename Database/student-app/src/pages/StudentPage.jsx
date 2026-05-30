import {
  useEffect,
  useState
} from "react";

import {
  doc,
  getDoc
} from "firebase/firestore";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import { db } from "../firebase";

import LessonList from "../components/LessonList";

import SearchBar from "../components/SearchBar";

function StudentPage() {

  const { courseId } =
    useParams();

  const navigate =
    useNavigate();

  const [userData,
  setUserData]

    = useState(null);

  const [search,
  setSearch]

    = useState("");

  // -----------------------------
  // FETCH USER
  // -----------------------------

  useEffect(() => {

    fetchUser();

  }, []);

  // -----------------------------
  // VOICE COMMANDS
  // -----------------------------


  // ---------------- FETCH USER ----------------

  const fetchUser =
    async () => {

    try {

      const storedUser =
        JSON.parse(

          localStorage.getItem(
            "user"
          )

        );

      // NOT LOGGED IN

      if (!storedUser) {

        navigate("/login");

        return;
      }

      const userRef = doc(

        db,
        "users",
        storedUser.uid

      );

      const userSnap =
        await getDoc(userRef);

      if (userSnap.exists()) {

        const data =
          userSnap.data();

        // CHECK REGISTERED COURSE

        const user =
          JSON.parse(

            localStorage.getItem(
              "user"
            )

          );

        const isAdmin =

          user?.role
            ?.toLowerCase() ===
          "admin";

        const allowed =

          data.registeredCourses
            ?.includes(
              courseId
            );

        // ADMIN CAN ACCESS EVERYTHING

        if (
          !allowed &&
          !isAdmin
        ) {

          alert(
            "Not registered for this course"
          );

          navigate("/");

          return;
        }

        setUserData(data);

      }

    }

    catch (error) {

      console.log(error);

    }

  };

  return (

    <div
      style={{
        padding: "30px",
        background: "#f5f7fb",
        minHeight: "100vh"
      }}
    >

      {/* STUDENT INFO */}

      {

        userData && (

          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "20px"
            }}
          >

            <h1>
              Welcome {userData.name}
            </h1>

            <p>
              Adaptive Level:
              {" "}
              {userData.adaptiveLevel}
            </p>

            <p>
              Disability Type:
              {" "}
              {userData.disabilityType}
            </p>

          </div>

        )

      }

      {/* LESSON TITLE */}

      <h2>
        Course Lessons
      </h2>

      {/* SEARCH BAR */}

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px"
        }}
      >

        <SearchBar
          search={search}
          setSearch={setSearch}
        />

      </div>

      {/* LESSON LIST */}

      <LessonList
        role="student"
        courseId={courseId}
        search={search}
      />

    </div>
  );
}

export default StudentPage;