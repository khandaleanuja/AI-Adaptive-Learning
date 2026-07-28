import "./AddLesson.css";

import {
  useState,
  useEffect
} from "react";

import {
  collection,
  addDoc,
  getDocs
} from "firebase/firestore";

import { db } from "../../firebase";
function AddLesson() {

  const [title, setTitle]
    = useState("");

  const [category, setCategory]
    = useState("");

  const [standardText, setStandardText]
    = useState("");

  const [simpleText, setSimpleText]
    = useState("");

  const [courseId, setCourseId]
    = useState("");

  const [courses, setCourses]
    = useState([]);

  // FETCH COURSES

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

  // ADD LESSON

  const addLesson = async () => {

    try {

      if (!courseId) {

        alert("Select Course");

        return;
      }

      await addDoc(

        collection(db, "lessons"),

        {

          title,

          category,

          courseId,

          standardText,

          simpleText,

          difficultyLevel: 1,

          audioUrl: ""

        }

      );

      alert("Lesson Added");

      // CLEAR FORM

      setTitle("");

      setCategory("");

      setCourseId("");

      setStandardText("");

      setSimpleText("");

    }

    catch (error) {

      alert(error.message);

    }
  };

  return (

    <div className="lesson-form">

      <h2>
        Add Lesson
      </h2>

      {/* COURSE SELECT */}

      <select
        value={courseId}
        onChange={(e) =>
          setCourseId(e.target.value)
        }
      >

        <option value="">
          Select Course
        </option>

        {

          courses.map((course) => (

            <option
              key={course.id}
              value={course.id}
            >

              {course.title}

            </option>

          ))

        }

      </select>

      {/* TITLE */}

      <input
        placeholder="Lesson Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      {/* CATEGORY */}

      <input
        placeholder="Category"
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
      />

      

      {/* STANDARD TEXT */}

      <textarea
        placeholder="Standard Text"
        rows="4"
        value={standardText}
        onChange={(e) =>
          setStandardText(
            e.target.value
          )
        }
      />

      {/* SIMPLE TEXT */}

      <textarea
        placeholder="Simple Text"
        rows="4"
        value={simpleText}
        onChange={(e) =>
          setSimpleText(
            e.target.value
          )
        }
      />

      {/* BUTTON */}

      <button onClick={addLesson}>

        Add Lesson

      </button>

    </div>

  );
}

export default AddLesson;