import {
  useState,
  useEffect
} from "react";
import "./login.css";

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

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate =
    useNavigate();

  // -------------------------
  // AUTO START VOICE LOGIN
  // -------------------------

  useEffect(() => {

    const voiceEnabled =

      localStorage.getItem(
        "voiceEnabled"
      );

    if (
      voiceEnabled === "true"
    ) {

      setTimeout(() => {

        startVoiceLogin();

      }, 1000);

    }

  }, []);

  // -------------------------
  // SPEAK FUNCTION
  // -------------------------

  const speak = (text) => {

    return new Promise((resolve) => {

      window.speechSynthesis.cancel();

      const speech =

        new SpeechSynthesisUtterance(
          text
        );

      speech.rate = 0.9;

      speech.lang = "en-US";

      speech.onend = () => {

        resolve();

      };

      window.speechSynthesis.speak(
        speech
      );

    });

  };

  // -------------------------
  // LISTEN FUNCTION
  // -------------------------

  const listen = () => {

    return new Promise((resolve) => {

      const SpeechRecognition =

        window.SpeechRecognition ||

        window.webkitSpeechRecognition;

      if (!SpeechRecognition) {

        alert(
          "Speech Recognition not supported"
        );

        resolve("");

        return;
      }

      const recognition =

        new SpeechRecognition();

      recognition.lang = "en-US";

      recognition.continuous = false;

      recognition.interimResults = false;

      recognition.start();

      recognition.onresult = (
        event
      ) => {

        const voiceText =

          event.results[0][0]
            .transcript;

        recognition.stop();

        resolve(voiceText);

      };

      recognition.onerror = (
        event
      ) => {

        console.log(
          event.error
        );

        recognition.stop();

        resolve("");

      };

    });

  };

  // -------------------------
  // VOICE LOGIN
  // -------------------------

  const startVoiceLogin =
    async () => {

    try {

      // EMAIL

      await speak(

        "Login page loaded. Please tell your email"

      );

      const userEmail =
        await listen();

      console.log(
        "Email:",
        userEmail
      );

      const cleanEmail =

        userEmail

          .replace(/ at /g, "@")

          .replace(/ dot /g, ".")

          .replace(/\s/g, "");

      setEmail(cleanEmail);

      // PASSWORD

      await speak(

        "Please tell your password"

      );

      const userPassword =
        await listen();

      console.log(
        "Password:",
        userPassword
      );

      setPassword(userPassword);

      // LOGIN

      const userCredential =

        await signInWithEmailAndPassword(

          auth,

          cleanEmail,

          userPassword

        );

      const user =
        userCredential.user;

      localStorage.setItem(
        "userId",
        user.uid
      );

      // FETCH USER DATA

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

        localStorage.setItem(

          "user",

          JSON.stringify({

            uid: user.uid,

            email: user.email,

            role: userData.role,

            name: userData.name,

            speechPreference:
              userData.speechPreference,

            adaptiveLevel:
              userData.adaptiveLevel,

            voiceEnabled:
              userData.voiceEnabled,

            accessibilityMode:
              userData.accessibilityMode

          })

        );

      }

      // SUCCESS

      await speak(
        "Login successful"
      );

      setTimeout(() => {

        navigate("/");

      }, 1000);

    }

    catch (error) {

      console.log(error);

      await speak(
        "Login failed"
      );

    }

  };

  // -------------------------
  // NORMAL LOGIN
  // -------------------------

  const loginUser =
    async () => {

    try {

      const userCredential =

        await signInWithEmailAndPassword(

          auth,

          email,

          password

        );

      const user =
        userCredential.user;

      localStorage.setItem(
        "userId",
        user.uid
      );

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

        localStorage.setItem(

          "user",

          JSON.stringify({

            uid: user.uid,

            email: user.email,

            role: userData.role,

            name: userData.name,

            speechPreference:
              userData.speechPreference,

            adaptiveLevel:
              userData.adaptiveLevel,

            voiceEnabled:
              userData.voiceEnabled,

            accessibilityMode:
              userData.accessibilityMode

          })

        );

        await speak(
          "Login successful"
        );

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

        alert(
          "User data not found"
        );

      }

    }

    catch (error) {

      console.log(error);

      await speak(
        "Login failed"
      );

      alert(error.message);

    }

  };

 return (
  <div style={{
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    fontFamily: "system-ui",
    background: "linear-gradient(135deg, #e0f2fe, #ffffff)"
  }}>

    <div style={{
      width: "350px",
      padding: "30px",

      background: "#fff",
      borderRadius: "16px",

      boxShadow: "0 12px 30px rgba(0,0,0,0.12)",

      textAlign: "center"
    }}>

      <h1>Login</h1>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          margin: "10px 0",
          borderRadius: "10px",
          border: "1px solid #cbd5e1"
        }}
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          margin: "10px 0",
          borderRadius: "10px",
          border: "1px solid #cbd5e1"
        }}
      />

      <button
        onClick={loginUser}
        style={{
          width: "100%",
          padding: "12px",
          background: "#38bdf8",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer"
        }}
      >
        Login
      </button>

    </div>
  </div>
);
}

export default Login;