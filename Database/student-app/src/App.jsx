import {

  BrowserRouter,

  Routes,

  Route

} from "react-router-dom";

import Home from "./pages/Home";

import Login from "./pages/Login";

import Register from "./pages/Register";

import AdminPage from "./pages/AdminPage";

import StudentPage from "./pages/StudentPage";

import MyCourses from "./pages/MyCourses";

import AddLesson from "./pages/AddLesson";

import ManageLessons from "./pages/ManageLessons";

import AdminCoursePage from "./pages/AdminCoursePage";
import VoiceAssistant
from "./components/VoiceAssistant";
import Navbar from "./pages/navbar";
import AboutPage from "./pages/About";


function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/about"
          element={<AboutPage />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/admin"
          element={<AdminPage />}
        />

        <Route
          path="/student"
          element={<StudentPage />}
        />

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

      </Routes>
<Navbar/>

    </BrowserRouter>
  );
}

export default App;