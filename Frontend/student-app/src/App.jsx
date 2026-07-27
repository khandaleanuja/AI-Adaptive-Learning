// import {

//   BrowserRouter,

//   Routes,

//   Route

// } from "react-router-dom";

// import Home from "./pages/Home";

// import Login from "./pages/Login";

// import Register from "./pages/Register";

// import AdminPage from "./pages/AdminPage";

// import StudentPage from "./pages/StudentPage";

// import MyCourses from "./pages/MyCourses";

// import AddLesson from "./pages/AddLesson";

// import ManageLessons from "./pages/ManageLessons";

// import AdminCoursePage from "./pages/AdminCoursePage";
// import Quiz from "./pages/quiz";
// import VoiceAssistant
// from "./components/VoiceAssistant";
// import Navbar from "./pages/navbar";
// import AboutPage from "./pages/About";


// import ProgressPage from "./pages/ProgressPage";

// function App() {

//   return (
//     <BrowserRouter>

//       <Routes>

//         <Route
//           path="/"
//           element={<Home />}
//         />
//         <Route
//           path="/about"
//           element={<AboutPage />}
//         />

//         <Route
//           path="/login"
//           element={<Login />}
//         />

//         <Route
//           path="/register"
//           element={<Register />}
//         />

//                 <Route
//           path="/quiz/:lessonId"
//           element={<Quiz />}
//         />

//         <Route
//           path="/admin"
//           element={<AdminPage />}
//         />

//         <Route
//           path="/student"
//           element={<StudentPage />}
//         />

//         <Route
//           path="/student/:courseId"
//           element={<StudentPage />}
//         />
        

//         <Route

//   path="/mycourses"
//   element={<MyCourses />}
// />

//     <Route
//   path="/addlesson"
//   element={<AddLesson />}
// />

// <Route
//   path="/managelessons"
//   element={<ManageLessons />}
// />

//       <Route
//   path="/admin/course/:id"
//   element={<AdminCoursePage />}
// />




//       </Routes>
// <Navbar/>

//     </BrowserRouter>
//   );
// }

// export default App;
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { db } from "./firebase";

// Home
import Home from "./pages/Home/Home";
import StudentPage from "./pages/Home/StudentPage";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// About
import AboutPage from "./pages/About/About";

// Admin
import AdminPage from "./pages/Admin/AdminPage";
import AddLesson from "./pages/Admin/AddLesson";
import ManageLessons from "./pages/Admin/ManageLessons";
import AdminCoursePage from "./pages/Admin/AdminCoursePage";

// My Courses
import MyCourses from "./pages/MyCourses/MyCourses";

// Progress
import ProgressPage from "./pages/Progress/ProgressPage";

// Quiz
import Quiz from "./pages/Quiz/Quiz";

// Components
import Navbar from "./components/Navbar/Navbar";
import VoiceAssistant from "./components/VoiceAssistant/VoiceAssistant";

function App() {
  return (
    <BrowserRouter>

      <Navbar />
      <VoiceAssistant />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<AboutPage />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<AdminPage />} />

        <Route path="/student" element={<StudentPage />} />

        <Route
          path="/student/:courseId"
          element={<StudentPage />}
        />

        <Route
          path="/mycourses"
          element={<MyCourses />}
        />

        <Route
          path="/addlesson"
          element={<AddLesson />}
        />

        <Route
          path="/managelessons"
          element={<ManageLessons />}
        />

        <Route
          path="/admin/course/:id"
          element={<AdminCoursePage />}
        />

        <Route
          path="/quiz/:lessonId"
          element={<Quiz />}
        />

        <Route
          path="/progress"
          element={<ProgressPage />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;