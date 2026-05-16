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

function ProgressPage() {

  const [progress, setProgress]
    = useState([]);

  useEffect(() => {

    fetchProgress();

  }, []);

  const fetchProgress = async () => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const q = query(

      collection(db, "progress"),

      where(
        "userId",
        "==",
        user.uid
      )

    );

    const querySnapshot =
      await getDocs(q);

    const progressList = [];

    querySnapshot.forEach((doc) => {

      progressList.push({
        id: doc.id,
        ...doc.data()
      });

    });

    setProgress(progressList);
  };

  return (

    <div style={{ padding: "30px" }}>

      <h1>
        Learning Progress
      </h1>

      {

        progress.map((item) => (

          <div
            key={item.id}
            style={{
              border: "1px solid gray",
              padding: "15px",
              marginBottom: "10px"
            }}
          >

            <p>
              Lesson:
              {item.lessonId}
            </p>

            <p>
              Score:
              {item.score}
            </p>

            <p>
              Response Time:
              {item.responseTime}
            </p>

            <p>
              Adaptive Level:
              {item.adaptiveLevel}
            </p>

          </div>

        ))

      }

    </div>
  );
}

export default ProgressPage;