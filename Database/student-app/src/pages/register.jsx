import { useState ,useEffect} from "react";

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

 const speak = (text) => {

  return new Promise((resolve) => {

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(text);

    speech.rate = 0.9;
    speech.lang = "en-US";

    speech.onend = () => resolve();

    window.speechSynthesis.speak(speech);

  });

};

const listen = () => {

  return new Promise((resolve) => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = (event) => {

      resolve(
        event.results[0][0].transcript
      );

    };

    recognition.onerror = () => {

      resolve("");

    };

  });

};

useEffect(() => {

  const voiceEnabled =
    localStorage.getItem(
      "voiceEnabled"
    );

  if (voiceEnabled === "true") {

    setTimeout(() => {

      startVoiceRegister();

    }, 1000);

  }

}, []);

const startVoiceRegister = async () => {

  try {

    await speak(
      "Register page loaded. Please tell your name"
    );

    const userName =
      await listen();

    setName(userName);

    await speak(
      "Please tell your email"
    );

    const userEmail =
      await listen();

    const cleanEmail =
      userEmail
        .replace(/ at /gi, "@")
        .replace(/ dot /gi, ".")
        .replace(/\s/g, "");

    setEmail(cleanEmail);

    await speak(
      "Please tell your password"
    );

    const userPassword =
      await listen();

    setPassword(userPassword);

    await registerUserVoice(
      userName,
      cleanEmail,
      userPassword
    );

  }

  catch (error) {

    console.log(error);

  }

};

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

const successSpeech = new SpeechSynthesisUtterance(
  "Registration successful. Redirecting to login page."
);

successSpeech.rate = 0.9;
successSpeech.lang = "en-US";

successSpeech.onend = () => {
  navigate("/login");
};

window.speechSynthesis.speak(successSpeech);

    }

    catch (error) {
      alert(error.message);
    }
  };

  const registerUserVoice = async (
  voiceName,
  voiceEmail,
  voicePassword
) => {

  try {

    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        voiceEmail,
        voicePassword
      );

    const user =
      userCredential.user;

    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        name: voiceName,
        email: voiceEmail,
        role: "student",
        registeredCourses: [],
        adaptiveLevel: "Level 1",
        speechPreference: 1,
        createdAt: new Date()
      }
    );

    await speak(
      "Registration successful. Redirecting to login page"
    );

    navigate("/login");

  }

  catch (error) {

    await speak(
      "Registration failed"
    );

    console.log(error);

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
      width: "370px",
      padding: "30px",

      background: "#fff",
      borderRadius: "16px",

      boxShadow: "0 12px 30px rgba(0,0,0,0.12)",

      textAlign: "center"
    }}>

      <h1 style={{ marginBottom: "20px" }}>
        Register
      </h1>

      {/* NAME */}
      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          margin: "10px 0",

          borderRadius: "10px",
          border: "1px solid #cbd5e1"
        }}
      />

      {/* EMAIL */}
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

      {/* PASSWORD */}
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


      {/* REGISTER BUTTON */}
      <button
        onClick={registerUser}
        style={{
          width: "100%",
          padding: "12px",

          background: "#38bdf8",
          color: "white",

          border: "none",
          borderRadius: "10px",

          cursor: "pointer",

          marginTop: "10px"
        }}
      >
        Register
      </button>

    </div>
  </div>
);
}

export default Register;