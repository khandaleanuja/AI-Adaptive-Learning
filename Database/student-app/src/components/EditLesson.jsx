import { useState } from "react";

import {
  doc,
  updateDoc
} from "firebase/firestore";

import { db } from "../firebase";

function EditLesson({ lesson }) {

  const [showModal, setShowModal]
    = useState(false);

  const [title, setTitle]
    = useState(lesson.title);

  const [category, setCategory]
    = useState(lesson.category);

  const [standardText, setStandardText]
    = useState(lesson.standardText);

  const [simpleText, setSimpleText]
    = useState(lesson.simpleText);

  const updateLesson = async () => {

    try {

      const lessonRef = doc(
        db,
        "lessons",
        lesson.id
      );

      await updateDoc(lessonRef, {

        title,

        category,

        standardText,

        simpleText

      });

      alert("Lesson Updated");

      setShowModal(false);

      window.location.reload();

    }

    catch (error) {

      alert(error.message);

    }
  };

  return (

    <div>

      <button
        className="edit-btn"
        onClick={() =>
          setShowModal(true)
        }
      >

        Edit

      </button>

      {

        showModal && (

          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor:
                "rgba(0,0,0,0.5)",

              display: "flex",

              justifyContent:
                "center",

              alignItems: "center"
            }}
          >

            <div
              style={{
                background: "white",

                padding: "30px",

                borderRadius: "10px",

                width: "400px"
              }}
            >

              <h2>Edit Lesson</h2>

              <input
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }

                style={{
                  width: "100%",
                  padding: "10px"
                }}
              />

              <br /><br />

              <input
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }

                style={{
                  width: "100%",
                  padding: "10px"
                }}
              />

              <br /><br />

              <textarea
                value={standardText}
                onChange={(e) =>
                  setStandardText(
                    e.target.value
                  )
                }

                rows="4"

                style={{
                  width: "100%",
                  padding: "10px"
                }}
              />

              <br /><br />

              <textarea
                value={simpleText}
                onChange={(e) =>
                  setSimpleText(
                    e.target.value
                  )
                }

                rows="4"

                style={{
                  width: "100%",
                  padding: "10px"
                }}
              />

              <br /><br />

              <button
                onClick={updateLesson}
              >

                Update

              </button>

              <button
                onClick={() =>
                  setShowModal(false)
                }

                style={{
                  marginLeft: "10px"
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

export default EditLesson;