import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import"./navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleMyCourses = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
    } else {
      navigate("/mycourses");
    }
  };

  return (
    <>
      <div className="navbar">

        {/* LEFT SIDE */}
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Adaptive AI platform</h3>
           <button onClick={() => navigate("/")}>
            Home
          </button>

          {/* ✅ ALWAYS VISIBLE MY COURSES */}
          <button onClick={handleMyCourses}>
            My Courses
          </button>
        <button onClick={() => navigate("/about")}>
            About
          </button>
          </div>

        {/* RIGHT SIDE */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

          {user ? (
            <>
              <span
                onClick={() => setShowProfile(true)}
                style={{
                  background: "#fff",
                  color: "#0ea5e9",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  cursor: "pointer"
                }}
              >
                {user.role === "admin"
                  ? "Admin"
                  : user.name || user.email}
              </span>

              <button onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => navigate("/login")}>
              Login
            </button>
          )}

        </div>
      </div>

      {/* PROFILE POPUP */}
      {showProfile && user && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,

          width: "100%",
          height: "100%",

          background: "rgba(0,0,0,0.4)",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          zIndex: 999
        }}>

          <div style={{
            width: "320px",
            background: "white",
            padding: "20px",
            borderRadius: "12px"
          }}>

            <h3>User Info</h3>

            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Role:</b> {user.role}</p>

            <button onClick={() => setShowProfile(false)}>
              Close
            </button>

          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;