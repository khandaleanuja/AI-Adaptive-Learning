import { useState } from "react";

import {
  createUserWithEmailAndPassword
} from "firebase/auth";

import {
  doc,
  setDoc
} from "firebase/firestore";

import {
  useNavigate
} from "react-router-dom";

import {
  auth,
  db
} from "../firebase";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabilityType, setDisabilityType]
    = useState("");

  const navigate = useNavigate();

  const registerUser = async () => {

    try {

      const cleanEmail =
        email.trim().toLowerCase();

      let userRole = "student";

      const adminEmails = [
        "sakshi@gmail.com",
        "teacher@gmail.com"
      ];

      if (
        adminEmails.includes(cleanEmail)
      ) {
        userRole = "admin";
      }

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );

      const user = userCredential.user;

      // ✅ FINAL USER STRUCTURE
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,

          name,

          email: cleanEmail,

          role: userRole,

          registeredCourses: [],

          disabilityType,

          adaptiveLevel: "Level 1",

          speechPreference: 1,

          createdAt: new Date()
        }
      );

      alert("Registration Successful");

      navigate("/login");

    }

    catch (error) {
      alert(error.message);
    }
  };

  return (

    <div style={{ padding: "40px" }}>

      <h1>Register</h1>

      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <br /><br />

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br /><br />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br /><br />

      <select
        value={disabilityType}
        onChange={(e) =>
          setDisabilityType(e.target.value)
        }
      >

        <option value="">
          Select Disability Type
        </option>

        <option value="Visual Impairment">
          Visual Impairment
        </option>

        <option value="Hearing Impairment">
          Hearing Impairment
        </option>

        <option value="Learning Disability">
          Learning Disability
        </option>

      </select>

      <br /><br />

      <button onClick={registerUser}>
        Register
      </button>

    </div>
  );
}

export default Register;