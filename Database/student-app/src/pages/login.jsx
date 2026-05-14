import { useState } from "react";

import {
  signInWithEmailAndPassword
} from "firebase/auth";

import {
  doc,
  getDoc
} from "firebase/firestore";

import {
  useNavigate
} from "react-router-dom";

import {
  auth,
  db
} from "../firebase";

function Login() {

  const [email, setEmail]
    = useState("");

  const [password, setPassword]
    = useState("");

  const navigate = useNavigate();

  const loginUser = async () => {

    try {

      const userCredential =

        await signInWithEmailAndPassword(

          auth,

          email,

          password

        );

      const user =
        userCredential.user;

      const userRef = doc(
        db,
        "users",
        user.uid
      );

      const userSnap =
        await getDoc(userRef);

      if (userSnap.exists()) {

        const userData =
          userSnap.data();

        // STORE USER

        localStorage.setItem(

  "user",

  JSON.stringify({

    uid: user.uid,

    email: user.email,

    role: userData.role,

    name: userData.name,

    disabilityType:
      userData.disabilityType,

    speechPreference:
      userData.speechPreference,

    adaptiveLevel:
      userData.adaptiveLevel

  })

);
       
        // ROLE BASED LOGIN

        if (
          userData.role === "admin"
        ) {

          navigate("/admin");

        }

        else {

          navigate("/");

        }
      }

      else {

        alert("User data not found");

      }

    }

    catch (error) {

      alert(error.message);

    }
  };

  return (

    <div style={{ padding: "40px" }}>

      <h1>Login</h1>

      <input
        type="email"
        placeholder="Enter Email"
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br /><br />

      <input
        type="password"
        placeholder="Enter Password"
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br /><br />

      <button onClick={loginUser}>

        Login

      </button>

    </div>
  );
}

export default Login;