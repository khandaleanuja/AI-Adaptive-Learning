import {
  useEffect,
  useState
} from "react";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

import { db } from "../../firebase";
function ManageLessons() {

  const [lessons, setLessons]
    = useState([]);

  const [showModal, setShowModal]
    = useState(false);

  const [selectedLesson,
    setSelectedLesson]
    = useState(null);

  const [title, setTitle]
    = useState("");

  const [category, setCategory]
    = useState("");

  const [standardText,
    setStandardText]
    = useState("");

  const [simpleText,
    setSimpleText]
    = useState("");

  useEffect(() => {

    fetchLessons();

  }, []);

  // FETCH LESSONS

  const fetchLessons = async () => {

    const querySnapshot =
      await getDocs(
        collection(db, "lessons")
      );

    const lessonList = [];

    querySnapshot.forEach((docSnap) => {

      lessonList.push({
        id: docSnap.id,
        ...docSnap.data()
      });

    });

    setLessons(lessonList);
  };

  // DELETE LESSON

  const deleteLesson = async (id) => {

    await deleteDoc(
      doc(db, "lessons", id)
    );

    fetchLessons();
  };

  // OPEN UPDATE MODAL

  const openUpdateModal = (
    lesson
  ) => {

    setSelectedLesson(lesson);

    setTitle(lesson.title);

    setCategory(
      lesson.category
    );

    setStandardText(
      lesson.standardText
    );

    setSimpleText(
      lesson.simpleText
    );

    setShowModal(true);
  };

  // UPDATE LESSON

  const updateLesson = async () => {

    try {

      const lessonRef = doc(
        db,
        "lessons",
        selectedLesson.id
      );

      await updateDoc(
        lessonRef,
        {
          title,
          category,
          standardText,
          simpleText
        }
      );

      alert(
        "Lesson Updated Successfully"
      );

      setShowModal(false);

      fetchLessons();

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

      <h1
        style={{
          textAlign: "center",
          marginBottom: "40px"
        }}
      >
        Manage Lessons
      </h1>

      {

        lessons.map((lesson) => (

          <div
            key={lesson.id}
            style={{
              background: "white",
              padding: "25px",
              marginBottom: "20px",
              borderRadius: "12px",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.1)"
            }}
          >

            <h2>
              {lesson.title}
            </h2>

            <p>
              <strong>
                Category:
              </strong>
              {" "}
              {lesson.category}
            </p>

            <p>
              <strong>
                Course:
              </strong>
              {" "}
              {lesson.courseId}
            </p>

            <div
              style={{
                marginTop: "20px"
              }}
            >

              <button
                onClick={() =>
                  openUpdateModal(
                    lesson
                  )
                }
                style={{
                  padding:
                    "10px 20px",
                  background:
                    "#3563e9",
                  color: "white",
                  border: "none",
                  borderRadius:
                    "8px",
                  cursor: "pointer"
                }}
              >

                Update Lesson

              </button>

              <button
                onClick={() =>
                  deleteLesson(
                    lesson.id
                  )
                }
                style={{
                  padding:
                    "10px 20px",
                  background:
                    "red",
                  color: "white",
                  border: "none",
                  borderRadius:
                    "8px",
                  marginLeft: "10px",
                  cursor: "pointer"
                }}
              >

                Delete Lesson

              </button>

            </div>

          </div>

        ))

      }

      {/* UPDATE MODAL */}

      {

        showModal && (

          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent:
                "center",
              alignItems:
                "center"
            }}
          >

            <div
              style={{
                background: "white",
                padding: "30px",
                borderRadius:
                  "12px",
                width: "500px"
              }}
            >

              <h2
                style={{
                  marginBottom:
                    "20px"
                }}
              >
                Update Lesson
              </h2>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="Title"
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom:
                    "15px"
                }}
              />

              <input
                type="text"
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                placeholder="Category"
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom:
                    "15px"
                }}
              />

              <textarea
                rows="4"
                value={standardText}
                onChange={(e) =>
                  setStandardText(
                    e.target.value
                  )
                }
                placeholder="Standard Text"
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom:
                    "15px"
                }}
              />

              <textarea
                rows="4"
                value={simpleText}
                onChange={(e) =>
                  setSimpleText(
                    e.target.value
                  )
                }
                placeholder="Simple Text"
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom:
                    "15px"
                }}
              />

              <button
                onClick={
                  updateLesson
                }
                style={{
                  padding:
                    "12px 20px",
                  background:
                    "#3563e9",
                  color: "white",
                  border: "none",
                  borderRadius:
                    "8px",
                  marginRight:
                    "10px",
                  cursor: "pointer"
                }}
              >

                Save Changes

              </button>

              <button
                onClick={() =>
                  setShowModal(
                    false
                  )
                }
                style={{
                  padding:
                    "12px 20px",
                  background:
                    "gray",
                  color: "white",
                  border: "none",
                  borderRadius:
                    "8px",
                  cursor: "pointer"
                }}
              >

                Cancel

              </button>

            </div>

          </div>

        )

      }

    </div>
  );
}

export default ManageLessons;