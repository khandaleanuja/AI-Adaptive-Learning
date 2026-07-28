import { useParams } from "react-router-dom";
import LessonList from "../Lessons/LessonList";
function AdminCoursePage() {

  const { id } = useParams();

  return (
    <div>

      <h2 style={{ textAlign: "center" }}>
        Admin Course Lessons
      </h2>

      {/* REUSE SAME COMPONENT */}
      <LessonList
        courseId={id}
        role="admin"
      />

    </div>
  );
}

export default AdminCoursePage;