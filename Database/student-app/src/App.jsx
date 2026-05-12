import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  return (
    <BrowserRouter>

      <nav
        style={{
          display: "flex",
          gap: "20px",
          padding: "20px",
          background: "#222",
        }}
      >
        <Link to="/" style={{ color: "white" }}>
          Home
        </Link>

        <Link to="/login" style={{ color: "white" }}>
          Login
        </Link>

        <Link to="/register" style={{ color: "white" }}>
          Register
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;