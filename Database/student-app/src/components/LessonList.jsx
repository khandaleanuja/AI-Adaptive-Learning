import {
  useEffect,
  useState
} from "react";

import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

import { db } from "../firebase";

import LessonCard from "./LessonCard";

function LessonList({

  role,
  courseId,
  search,
  category

}) {

  const [lessons, setLessons]
    = useState([]);

  const [allLessons, setAllLessons]
    = useState([]);

  // ---------------- FETCH LESSONS ----------------
  useEffect(() => {

    if (courseId) {

      fetchLessons();

    }

  }, [courseId]);

  // ---------------- FILTER LESSONS ----------------
  useEffect(() => {

    filterLessons();

  }, [search, category, allLessons]);

  // ---------------- FETCH ----------------
  const fetchLessons = async () => {

    try {

      const q = query(

        collection(db, "lessons"),

        where(
          "courseId",
          "==",
          courseId
        )

      );

      const querySnapshot =
        await getDocs(q);

      const lessonList = [];

      querySnapshot.forEach((docSnap) => {

        const data =
          docSnap.data();

        // ONLY CURRENT COURSE
        if (
          data.courseId === courseId
        ) {

          lessonList.push({

            id: docSnap.id,

            ...data

          });

        }

      });

      // STORE ALL LESSONS
      setAllLessons(lessonList);

      // INITIAL DISPLAY
      setLessons(lessonList);

    }

    catch (error) {

      console.log(error);

    }
  };

  // ---------------- FILTER ----------------
  const filterLessons = () => {

    let filteredLessons =
      [...allLessons];

    // SEARCH FILTER
    if (search) {

      filteredLessons =
        filteredLessons.filter(

          (lesson) =>

            lesson.title
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )

        );

    }

    // CATEGORY FILTER
    if (category) {

      filteredLessons =
        filteredLessons.filter(

          (lesson) =>

            lesson.category === category

        );

    }

    setLessons(filteredLessons);
  };

  return (

    <div>

      {

        lessons.length > 0 ? (

          lessons.map((lesson) => (

            <LessonCard
              key={lesson.id}
              lesson={lesson}
              role={role}
            />

          ))

        ) : (

          <h3>
            No Lessons Found
          </h3>

        )

      }

    </div>
  );
}

export default LessonList;