// import {
//   useEffect,
//   useState,
//   useRef
// } from "react";

// function VoiceAssistant({

//   startVoiceLogin,

//   navigate

// }) {

//   const [

//     inactiveTime,

//     setInactiveTime

//   ] = useState(0);

//   const [

//     showPopup,

//     setShowPopup

//   ] = useState(false);

//   const [

//     voiceModeEnabled,

//     setVoiceModeEnabled

//   ] = useState(false);

//   const timerRef =
//     useRef(null);

//   const recognitionRef =
//     useRef(null);

//   const voiceModeRef = useRef(false);
//   // ---------------------------------
//   // START INACTIVITY TIMER
//   // ---------------------------------

//   useEffect(() => {

//     if (voiceModeEnabled)
//       return;

//     timerRef.current =

//       setInterval(() => {

//         setInactiveTime(
//           (prev) => prev + 1
//         );

//       }, 1000);

//     return () =>

//       clearInterval(
//         timerRef.current
//       );

//   }, [voiceModeEnabled]);

//   // ---------------------------------
//   // RESET TIMER ON USER ACTIVITY
//   // ---------------------------------

//   useEffect(() => {

//     const resetTimer = () => {

//       if (!voiceModeEnabled) {

//         setInactiveTime(0);

//       }

//     };

//     window.addEventListener(
//       "mousemove",
//       resetTimer
//     );

//     window.addEventListener(
//       "keydown",
//       resetTimer
//     );

//     window.addEventListener(
//       "click",
//       resetTimer
//     );

//     return () => {

//       window.removeEventListener(
//         "mousemove",
//         resetTimer
//       );

//       window.removeEventListener(
//         "keydown",
//         resetTimer
//       );

//       window.removeEventListener(
//         "click",
//         resetTimer
//       );

//     };

//   }, [voiceModeEnabled]);

//   // ---------------------------------
//   // SHOW POPUP AFTER INACTIVITY
//   // ---------------------------------

//   useEffect(() => {

//     if (

//       inactiveTime >= 10 &&

//       !voiceModeEnabled &&

//       !showPopup

//     ) {

//       setShowPopup(true);
//   //     speakResponse(
//   //   "We noticed you may need help. Press one to enable voice assistance or press two to continue normally."
//   // );
//      // speakResponse();

//     }

//   }, [

//     inactiveTime,

//     voiceModeEnabled,

//     showPopup

//   ]);

//   // ---------------------------------
//   // SPEAK RESPONSE
//   // ---------------------------------

//   const speakResponse = (text) => {

//     window.speechSynthesis.cancel();

//     const speech =

//       new SpeechSynthesisUtterance(
//         text
//       );

//     speech.rate = 0.9;

//     speech.lang = "en-US";

//     window.speechSynthesis.speak(
//       speech
//     );

//   };

//   // ---------------------------------
//   // START VOICE COMMANDS
//   // ---------------------------------

//   const startVoiceCommands = () => {

//     const SpeechRecognition =

//       window.SpeechRecognition ||

//       window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {

//       alert(
//         "Speech Recognition not supported"
//       );

//       return;

//     }

//     // STOP OLD RECOGNITION

//     if (recognitionRef.current) {

//       recognitionRef.current.stop();

//     }

//     const recognition =
//       new SpeechRecognition();

//     recognitionRef.current =
//       recognition;

//     recognition.continuous = true;

//     recognition.interimResults =
//       false;

//     recognition.lang = "en-US";

//     // START MIC

//     recognition.start();

//     console.log(
//       "Voice Recognition Started"
//     );

//     // ---------------------------------
//     // LISTEN COMMANDS
//     // ---------------------------------

//     recognition.onresult = (
//       event
//     ) => {

//       const command =

//         event.results[
//           event.results.length - 1
//         ][0].transcript
//           .toLowerCase()
//           .trim();

//       console.log(
//         "COMMAND:",
//         command
//       );

//       // LESSONS

//       if (
//         command.includes("lesson")
//       ) {

//         speakResponse(
//           "Opening lessons page"
//         );

//         navigate("/lessons");

//       }

//       // COURSES

//       else if (

//         command.includes("course") ||

//         command.includes("courses") ||

//         command.includes("my course") ||

//         command.includes("my courses") ||

//         command.includes("mycourses")

//       ) {

//         speakResponse(
//           "Opening my courses page"
//         );

//         navigate("/mycourses");

//       }
 
//       // QUIZ

//       else if (
//         command.includes("quiz")
//       ) {

//         speakResponse(
//           "Opening quiz page"
//         );

//         navigate("/quiz");

//       }

//       // HOME

//       else if (
//         command.includes("home")
//       ) {

//         speakResponse(
//           "Opening home page"
//         );

//         navigate("/");

//       }

//       // LOGIN
// else if (command.includes("login")) {

//   speakResponse("Opening login page");

//   // Stop Voice Assistant
//   recognition.stop();
//   recognitionRef.current = null;

//   // Enable Login Voice Flow
//   localStorage.setItem("voiceEnabled", "true");

//   navigate("/login");

// }

//       // REGISTER

//       else if (

//   command.includes("register") ||

//   command.includes("registration") ||

//   command.includes(" go to register page") ||

//   command.includes("go to register")

// ) {
//   console.log("REGISTER BLOCK HIT")

//   speakResponse(
//     "Opening register page"
//   );

//   navigate("/register");

// }

//       // LOGOUT

//       else if (
//         command.includes("logout") ||
//         command.includes("log out") ||
//         command.includes("signout") ||
//         command.includes("sign out")
//       ) {

//         speakResponse(
//           "Logging out"
//         );

//         localStorage.clear();

//         navigate("/login");

//       }

//     };

//     // ---------------------------------
//     // ON END
//     // ---------------------------------

//         recognition.onend = () => {
//         console.log("Voice Recognition Ended");

//         if (
//           voiceModeRef.current &&
//           window.location.pathname !== "/login"
//         ) {
//           try {
//             recognition.start();
//           } catch (error) {
//             console.log("Recognition restart skipped:", error);
//           }
//         }
//       };

//     // ---------------------------------
//     // ON ERROR
//     // ---------------------------------

//     recognition.onerror = (
//       event
//     ) => {

//       console.log(
//         "VOICE ERROR:",
//         event.error
//       );

//       recognition.stop();

//     };

//   };

//   // ---------------------------------
//   // ENABLE VOICE MODE
//   // ---------------------------------

//   const enableVoice =
//     async () => {

//       localStorage.setItem("accessibilityMode", "blind");

//     clearInterval(
//       timerRef.current
//     );

//     voiceModeRef.current = true;

//     setVoiceModeEnabled(
//       true
//     );

//     setShowPopup(false);

//     setInactiveTime(0);

//     try {

//           if (typeof startVoiceLogin === "function") 
//           {
//             await startVoiceLogin();
//           }

//           startVoiceCommands();

//         }
//         catch (error) {
//           console.log(error);
//         }

//   };

//   // ---------------------------------
//   // CONTINUE NORMAL MODE
//   // ---------------------------------

  
// const enableDeafMode = () => {
//   // Prevent voice recognition from restarting
//   voiceModeRef.current = false;

//   // Stop speech output
//   window.speechSynthesis.cancel();

//   // Stop microphone recognition
//   if (recognitionRef.current) {
//     recognitionRef.current.onend = null;
//     recognitionRef.current.stop();
//     recognitionRef.current = null;
//   }

//   // Save accessibility settings
//   localStorage.setItem("accessibilityMode", "deaf");
//   localStorage.setItem("voiceEnabled", "false");

//   // Update component state
//   setVoiceModeEnabled(false);
//   setShowPopup(false);
//   setInactiveTime(0);

//   console.log("Deaf Mode Enabled");
// };


//   // ---------------------------------
//   // CLEANUP
//   // ---------------------------------

// useEffect(() => {
//   const handleKeyDown = (event) => {
//     // Only respond while the accessibility popup is open
//     if (!showPopup || event.repeat) return;

//     // Don't trigger while typing in a form field
//     const tag = event.target?.tagName;

//     if (
//       ["INPUT", "TEXTAREA", "SELECT"].includes(tag) ||
//       event.target?.isContentEditable
//     ) {
//       return;
//     }

//     if (event.key === "2") {
//       event.preventDefault();
//       enableDeafMode();
//     }
//   };

//   window.addEventListener("keydown", handleKeyDown);

//   return () => {
//     window.removeEventListener("keydown", handleKeyDown);
//   };
// }, [showPopup]);




//   useEffect(() => {

//     return () => {

//       if (recognitionRef.current) {

//         recognitionRef.current.stop();

//       }

//     };

//   }, []);

//   return (

//     <div>

//       {

//         showPopup && (

//           <div

//             style={{

//               position: "fixed",

//               top: "30%",

//               left: "35%",

//               background: "white",

//               padding: "20px",

//               borderRadius: "10px",

//               border:
//                 "2px solid black",

//               zIndex: "999",

//               width: "300px",

//               textAlign: "center",

//               boxShadow:

//                 "0px 0px 10px rgba(0,0,0,0.3)"

//             }}

//           >

//             <h2>

//               Voice Assistance

//             </h2>

//             <p>

//               We noticed that
//               you may be
//               struggling to login.

//             </p>

//             <button

//               onClick={enableVoice}

//               style={{

//                 marginRight: "10px",

//                 padding: "10px"

//               }}

//             >

//               Press 1

//             </button>

//             <button

//               onClick={enableDeafMode}

//               style={{

//                 padding: "10px"

//               }}

//             >

//               Press 2

//             </button>

//           </div>

//         )

//       }

//     </div>

//   );

// }

// export default VoiceAssistant;




// import { useEffect, useRef, useState } from "react";

// function VoiceAssistant({ startVoiceLogin, navigate }) {
//   const [inactiveTime, setInactiveTime] = useState(0);

//   const [showPopup, setShowPopup] = useState(false);

//   const [voiceModeEnabled, setVoiceModeEnabled] = useState(() => {
//   return (
//     localStorage.getItem("accessibilityMode") === "blind" &&
//     localStorage.getItem("voiceEnabled") === "true"
//   );
// });

//   const timerRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const voiceModeRef = useRef(false);

//   // Keep the ref synchronized with the saved mode.
//   useEffect(() => {
//     voiceModeRef.current =
//       localStorage.getItem("accessibilityMode") === "blind" &&
//       localStorage.getItem("voiceEnabled") === "true";

//     setVoiceModeEnabled(voiceModeRef.current);
//   }, []);

//   // Stop voice mode whenever Deaf Mode is selected.
//   const stopVoice = () => {
//     voiceModeRef.current = false;

//     window.speechSynthesis.cancel();

//     if (recognitionRef.current) {
//       const recognition = recognitionRef.current;

//       recognitionRef.current = null;
//       recognition.onend = null;
//       recognition.onresult = null;
//       recognition.onerror = null;

//       try {
//         recognition.stop();
//       } catch (error) {
//         console.log("Recognition already stopped");
//       }
//     }

//     setVoiceModeEnabled(false);
//   };

//   // Start inactivity timer only in normal mode.
//   useEffect(() => {
//     if (
//       voiceModeEnabled ||
//       localStorage.getItem("accessibilityMode") === "deaf"
//     ) {
//       clearInterval(timerRef.current);
//       return;
//     }

//     timerRef.current = setInterval(() => {
//       setInactiveTime((previous) => previous + 1);
//     }, 1000);

//     return () => clearInterval(timerRef.current);
//   }, [voiceModeEnabled]);

//   // Reset inactivity on user activity.
//   useEffect(() => {
//     const resetTimer = () => {
//       if (
//         !voiceModeRef.current &&
//         localStorage.getItem("accessibilityMode") !== "deaf"
//       ) {
//         setInactiveTime(0);
//       }
//     };

//     window.addEventListener("mousemove", resetTimer);
//     window.addEventListener("keydown", resetTimer);
//     window.addEventListener("click", resetTimer);

//     return () => {
//       window.removeEventListener("mousemove", resetTimer);
//       window.removeEventListener("keydown", resetTimer);
//       window.removeEventListener("click", resetTimer);
//     };
//   }, []);

//   // Show the popup after 10 seconds, except in Deaf Mode.
//   useEffect(() => {
//     if (
//       inactiveTime >= 10 &&
//       !voiceModeEnabled &&
//       !showPopup &&
//       localStorage.getItem("accessibilityMode") !== "deaf"
//     ) {
//       setShowPopup(true);
//     }
//   }, [inactiveTime, voiceModeEnabled, showPopup]);

//   // Speak a response.
//   const speakResponse = (text) => {
//     if (
//       localStorage.getItem("accessibilityMode") === "deaf" ||
//       localStorage.getItem("voiceEnabled") !== "true"
//     ) {
//       return;
//     }

//     window.speechSynthesis.cancel();

//     const speech = new SpeechSynthesisUtterance(text);
//     speech.rate = 0.9;
//     speech.lang = "en-US";

//     window.speechSynthesis.speak(speech);
//   };

//   // Start voice commands only when Blind/Voice Mode is active.
//   const startVoiceCommands = () => {
//     if (
//       !voiceModeRef.current ||
//       localStorage.getItem("accessibilityMode") !== "blind" ||
//       localStorage.getItem("voiceEnabled") !== "true"
//     ) {
//       return;
//     }

//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       alert("Speech Recognition is not supported in this browser.");
//       return;
//     }

//     if (recognitionRef.current) {
//       try {
//         recognitionRef.current.onend = null;
//         recognitionRef.current.stop();
//       } catch (error) {
//         console.log(error);
//       }

//       recognitionRef.current = null;
//     }

//     const recognition = new SpeechRecognition();
//     recognitionRef.current = recognition;

//     recognition.continuous = true;
//     recognition.interimResults = false;
//     recognition.lang = "en-US";

//     recognition.onresult = (event) => {
//       if (!voiceModeRef.current) return;

//       const command = event.results[
//         event.results.length - 1
//       ][0].transcript.toLowerCase().trim();

//       console.log("COMMAND:", command);

//       if (command.includes("lesson")) {
//         speakResponse("Opening lessons page");
//         navigate("/lessons");
//       } else if (
//         command.includes("course") ||
//         command.includes("my course") ||
//         command.includes("my courses") ||
//         command.includes("mycourses")
//       ) {
//         speakResponse("Opening my courses page");
//         navigate("/mycourses");
//       } else if (command.includes("quiz")) {
//         speakResponse("Opening quiz page");
//         navigate("/quiz");
//       } else if (command.includes("home")) {
//         speakResponse("Opening home page");
//         navigate("/");
//       } else if (command.includes("login")) {
//         speakResponse("Opening login page");

//         // Keep voiceEnabled true for the login voice flow.
//         navigate("/login");
//       } else if (
//         command.includes("register") ||
//         command.includes("registration") ||
//         command.includes("go to register")
//       ) {
//         speakResponse("Opening register page");
//         navigate("/register");
//       } else if (
//         command.includes("logout") ||
//         command.includes("log out") ||
//         command.includes("signout") ||
//         command.includes("sign out")
//       ) {
//         stopVoice();

//         localStorage.removeItem("voiceEnabled");
//         localStorage.removeItem("accessibilityMode");

//         navigate("/login");
//       }
//     };

//     recognition.onend = () => {
//       if (recognitionRef.current !== recognition) return;

//       if (
//         voiceModeRef.current &&
//         localStorage.getItem("accessibilityMode") === "blind" &&
//         localStorage.getItem("voiceEnabled") === "true" &&
//         window.location.pathname !== "/login"
//       ) {
//         try {
//           recognition.start();
//         } catch (error) {
//           console.log("Recognition restart skipped:", error);
//         }
//       }
//     };

//     recognition.onerror = (event) => {
//       console.log("VOICE ERROR:", event.error);
//     };

//     try {
//       recognition.start();
//       console.log("Voice Recognition Started");
//     } catch (error) {
//       console.log("Could not start recognition:", error);
//     }
//   };

//   // Enable Blind/Voice Mode.
//   const enableVoice = async () => {
//     localStorage.setItem("accessibilityMode", "blind");
//     localStorage.setItem("voiceEnabled", "true");

//     voiceModeRef.current = true;

//     clearInterval(timerRef.current);
//     setVoiceModeEnabled(true);
//     setShowPopup(false);
//     setInactiveTime(0);

//     try {
//       if (typeof startVoiceLogin === "function") {
//         await startVoiceLogin();
//       }

//       startVoiceCommands();
//     } catch (error) {
//       console.log("Unable to enable voice mode:", error);
//     }
//   };

//   // Enable Deaf Mode.
//   const enableDeafMode = () => {
//     localStorage.setItem("accessibilityMode", "deaf");
//     localStorage.setItem("voiceEnabled", "false");

//     stopVoice();

//     clearInterval(timerRef.current);
//     setShowPopup(false);
//     setInactiveTime(0);

//     console.log("Deaf Mode Enabled");
//     navigate("/deaf-mode");
//   };

//   // Keyboard shortcut: 1 = voice, 2 = deaf.
//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (!showPopup || event.repeat) return;

//       const tag = event.target?.tagName;

//       if (
//         ["INPUT", "TEXTAREA", "SELECT"].includes(tag) ||
//         event.target?.isContentEditable
//       ) {
//         return;
//       }

//       if (event.key === "1") {
//         event.preventDefault();
//         enableVoice();
//       } else if (event.key === "2") {
//         event.preventDefault();
//         enableDeafMode();
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [showPopup]);

//   // Cleanup on unmount.
//   useEffect(() => {
//     return () => {
//       clearInterval(timerRef.current);

//       if (recognitionRef.current) {
//         const recognition = recognitionRef.current;
//         recognitionRef.current = null;
//         recognition.onend = null;
//         recognition.onresult = null;
//         recognition.onerror = null;

//         try {
//           recognition.stop();
//         } catch (error) {
//           console.log(error);
//         }
//       }

//       window.speechSynthesis.cancel();
//     };
//   }, []);

//   return (
//     <div>
//       {showPopup && (
//         <div
//           style={{
//             position: "fixed",
//             top: "30%",
//             left: "50%",
//             transform: "translateX(-50%)",
//             background: "white",
//             color: "black",
//             padding: "20px",
//             borderRadius: "10px",
//             border: "2px solid black",
//             zIndex: 9999,
//             width: "300px",
//             textAlign: "center",
//             boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
//           }}
//         >
//           <h2>Accessibility Assistance</h2>

//           <p>
//             Choose the accessibility mode you want to use.
//           </p>

//           <button
//             onClick={enableVoice}
//             style={{ marginRight: "10px", padding: "10px" }}
//           >
//             Press 1 — Voice Mode
//           </button>

//           <button
//             onClick={enableDeafMode}
//             style={{ padding: "10px" }}
//           >
//             Press 2 — Deaf Mode
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default VoiceAssistant;



// import { useEffect, useRef, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// function VoiceAssistant({ startVoiceLogin }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const pathname = location.pathname;

//   const [inactiveTime, setInactiveTime] = useState(0);
//   const [showPopup, setShowPopup] = useState(false);

//   const [voiceModeEnabled, setVoiceModeEnabled] = useState(
//     () =>
//       localStorage.getItem("accessibilityMode") === "blind" &&
//       localStorage.getItem("voiceEnabled") === "true"
//   );

//   const timerRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const voiceModeRef = useRef(false);

//   // Keep the voice-mode reference synchronized with saved settings.
//   useEffect(() => {
//     voiceModeRef.current =
//       localStorage.getItem("accessibilityMode") === "blind" &&
//       localStorage.getItem("voiceEnabled") === "true";
//   }, []);

//   // Stop only the global VoiceAssistant microphone.
//   const stopVoice = () => {
//     voiceModeRef.current = false;

//     if ("speechSynthesis" in window) {
//       window.speechSynthesis.cancel();
//     }

//     const recognition = recognitionRef.current;
//     recognitionRef.current = null;

//     if (recognition) {
//       recognition.onend = null;
//       recognition.onresult = null;
//       recognition.onerror = null;

//       try {
//         recognition.stop();
//       } catch (error) {
//         console.log("Microphone already stopped");
//       }
//     }

//     setVoiceModeEnabled(false);
//   };

//   // Enable Deaf Mode.
//   const enableDeafMode = () => {
//     localStorage.setItem("accessibilityMode", "deaf");
//     localStorage.setItem("voiceEnabled", "false");
//     localStorage.setItem("voiceChoice", "disabled");

//     stopVoice();

//     if (timerRef.current) {
//       clearInterval(timerRef.current);
//       timerRef.current = null;
//     }

//     setShowPopup(false);
//     setInactiveTime(0);

//     navigate("/deaf-mode");
//   };

//   // Speak only when Blind Mode is enabled.
//   const speakResponse = (text) => {
//     if (
//       localStorage.getItem("accessibilityMode") !== "blind" ||
//       localStorage.getItem("voiceEnabled") !== "true" ||
//       !("speechSynthesis" in window)
//     ) {
//       return;
//     }

//     window.speechSynthesis.cancel();

//     const speech = new SpeechSynthesisUtterance(text);
//     speech.lang = "en-US";
//     speech.rate = 0.9;

//     window.speechSynthesis.speak(speech);
//   };

//   // Global voice commands are disabled on student/lesson pages.
//   // LessonList.jsx handles voice commands on those pages.
//   const startVoiceCommands = () => {
//     if (
//       pathname.startsWith("/student/") ||
//       !voiceModeRef.current ||
//       localStorage.getItem("accessibilityMode") !== "blind" ||
//       localStorage.getItem("voiceEnabled") !== "true"
//     ) {
//       return;
//     }

//     if (recognitionRef.current) return;

//     const SpeechRecognition =
//       window.SpeechRecognition ||
//       window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       console.log("Speech recognition is not supported in this browser");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognitionRef.current = recognition;

//     recognition.continuous = true;
//     recognition.interimResults = false;
//     recognition.lang = "en-US";

//     recognition.onresult = (event) => {
//       if (
//         !voiceModeRef.current ||
//         localStorage.getItem("accessibilityMode") !== "blind" ||
//         localStorage.getItem("voiceEnabled") !== "true"
//       ) {
//         return;
//       }

//       const command = event.results[
//         event.results.length - 1
//       ][0].transcript.toLowerCase().trim();

//       if (command.includes("disable voice")) {
//         enableDeafMode();
//       } else if (command.includes("about")) {
//         speakResponse("Opening about page");
//         navigate("/about");
//       } else if (
//         command.includes("my courses") ||
//         command.includes("my course") ||
//         command.includes("mycourses")
//       ) {
//         speakResponse("Opening my courses");
//         navigate("/mycourses");
//       } else if (command.includes("home")) {
//         speakResponse("Opening home page");
//         navigate("/");
//       } else if (command.includes("login")) {
//         speakResponse("Opening login page");
//         navigate("/login");
//       } else if (
//         command.includes("register") ||
//         command.includes("registration")
//       ) {
//         speakResponse("Opening register page");
//         navigate("/register");
//       }
//     };

//     recognition.onend = () => {
//       if (recognitionRef.current !== recognition) return;

//       const shouldRestart =
//         !window.location.pathname.startsWith("/student/") &&
//         voiceModeRef.current &&
//         localStorage.getItem("accessibilityMode") === "blind" &&
//         localStorage.getItem("voiceEnabled") === "true" &&
//         window.location.pathname !== "/login";

//       if (shouldRestart) {
//         try {
//           recognition.start();
//         } catch (error) {
//           console.log("Recognition restart skipped", error);
//         }
//       }
//     };

//     recognition.onerror = (event) => {
//       console.log("Voice error:", event.error);
//     };

//     try {
//       recognition.start();
//     } catch (error) {
//       console.log("Could not start microphone", error);
//     }
//   };

//   // Enable Blind/Voice Mode.
//   const enableVoice = async () => {
//     localStorage.setItem("accessibilityMode", "blind");
//     localStorage.setItem("voiceEnabled", "true");
//     localStorage.setItem("voiceChoice", "enabled");

//     voiceModeRef.current = true;
//     setVoiceModeEnabled(true);
//     setShowPopup(false);
//     setInactiveTime(0);

//     if (timerRef.current) {
//       clearInterval(timerRef.current);
//       timerRef.current = null;
//     }

//     try {
//       if (typeof startVoiceLogin === "function") {
//         await startVoiceLogin();
//       }

//       // LessonList handles voice commands on student pages.
//       if (!window.location.pathname.startsWith("/student/")) {
//         startVoiceCommands();
//       }
//     } catch (error) {
//       console.log("Could not enable voice mode", error);
//     }
//   };

//   // Start inactivity timer when no accessibility mode is active.
//   useEffect(() => {
//     if (
//       voiceModeEnabled ||
//       localStorage.getItem("accessibilityMode") === "deaf"
//     ) {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//         timerRef.current = null;
//       }
//       return;
//     }

//     timerRef.current = setInterval(() => {
//       setInactiveTime((time) => time + 1);
//     }, 1000);

//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//         timerRef.current = null;
//       }
//     };
//   }, [voiceModeEnabled]);

//   // Reset inactivity when the user interacts with the page.
//   useEffect(() => {
//     const resetTimer = () => {
//       if (
//         !voiceModeRef.current &&
//         localStorage.getItem("accessibilityMode") !== "deaf"
//       ) {
//         setInactiveTime(0);
//       }
//     };

//     window.addEventListener("mousemove", resetTimer);
//     window.addEventListener("click", resetTimer);
//     window.addEventListener("keydown", resetTimer);

//     return () => {
//       window.removeEventListener("mousemove", resetTimer);
//       window.removeEventListener("click", resetTimer);
//       window.removeEventListener("keydown", resetTimer);
//     };
//   }, []);

//   // Show the accessibility popup after 10 seconds.
//   useEffect(() => {
//     if (
//       inactiveTime >= 10 &&
//       !voiceModeEnabled &&
//       !showPopup &&
//       localStorage.getItem("accessibilityMode") !== "deaf"
//     ) {
//       setShowPopup(true);
//     }
//   }, [inactiveTime, voiceModeEnabled, showPopup]);

//   // Start/stop global recognition when the route or voice setting changes.
//   useEffect(() => {
//     const isBlindMode =
//       localStorage.getItem("accessibilityMode") === "blind" &&
//       localStorage.getItem("voiceEnabled") === "true";

//     if (!voiceModeEnabled || !isBlindMode) {
//       return;
//     }

//     // Do not run the global microphone on student pages.
//     if (pathname.startsWith("/student/")) {
//       const recognition = recognitionRef.current;
//       recognitionRef.current = null;

//       if (recognition) {
//         recognition.onend = null;
//         recognition.onresult = null;
//         recognition.onerror = null;

//         try {
//           recognition.stop();
//         } catch (error) {
//           console.log("Global microphone already stopped");
//         }
//       }

//       return;
//     }

//     startVoiceCommands();
//   }, [pathname, voiceModeEnabled]);

//   // Keyboard shortcuts: 1 = Voice Mode, 2 = Deaf Mode.
//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (
//         event.repeat ||
//         event.ctrlKey ||
//         event.altKey ||
//         event.metaKey
//       ) {
//         return;
//       }

//       const tag = event.target?.tagName;

//       if (
//         ["INPUT", "TEXTAREA", "SELECT"].includes(tag) ||
//         event.target?.isContentEditable
//       ) {
//         return;
//       }

//       if (event.key === "2") {
//         event.preventDefault();
//         enableDeafMode();
//       } else if (event.key === "1" && showPopup) {
//         event.preventDefault();
//         enableVoice();
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [showPopup]);

//   // Cleanup when this component unmounts.
//   useEffect(() => {
//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }

//       const recognition = recognitionRef.current;
//       recognitionRef.current = null;

//       if (recognition) {
//         recognition.onend = null;
//         recognition.onresult = null;
//         recognition.onerror = null;

//         try {
//           recognition.stop();
//         } catch (error) {
//           console.log("Microphone cleanup:", error);
//         }
//       }

//       if ("speechSynthesis" in window) {
//         window.speechSynthesis.cancel();
//       }
//     };
//   }, []);

//   return (
//     <>
//       {showPopup && (
//         <div
//           role="dialog"
//           aria-labelledby="accessibility-title"
//           aria-modal="true"
//           style={{
//             position: "fixed",
//             top: "30%",
//             left: "50%",
//             transform: "translateX(-50%)",
//             background: "white",
//             color: "black",
//             padding: "20px",
//             borderRadius: "10px",
//             border: "2px solid black",
//             zIndex: 9999,
//             width: "300px",
//             maxWidth: "90%",
//             textAlign: "center",
//             boxShadow: "0 0 10px rgba(0,0,0,0.3)",
//           }}
//         >
//           <h2 id="accessibility-title">Accessibility Assistance</h2>
//           <p>Choose your accessibility mode.</p>

//           <button type="button" onClick={enableVoice}>
//             1 — Voice Mode
//           </button>

//           <button type="button" onClick={enableDeafMode}>
//             2 — Deaf Mode
//           </button>
//         </div>
//       )}
//     </>
//   );
// }

// export default VoiceAssistant;





import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function VoiceAssistant({ startVoiceLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const [inactiveTime, setInactiveTime] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const [voiceModeEnabled, setVoiceModeEnabled] = useState(
    () =>
      localStorage.getItem("accessibilityMode") === "blind" &&
      localStorage.getItem("voiceEnabled") === "true"
  );

  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const voiceModeRef = useRef(false);
  const lastAnnouncedPathRef = useRef("");

  const isStudentPage = (path) =>
    path === "/student" || path.startsWith("/student/");

   const isQuizPage = (path) => path.startsWith("/quiz/");

  // Keep voice mode synchronized with saved settings.
  useEffect(() => {
    const enabled =
      localStorage.getItem("accessibilityMode") === "blind" &&
      localStorage.getItem("voiceEnabled") === "true";

    voiceModeRef.current = enabled;
    setVoiceModeEnabled(enabled);
  }, []);

  const stopVoice = useCallback(() => {
    voiceModeRef.current = false;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    const recognition = recognitionRef.current;
    recognitionRef.current = null;

    if (recognition) {
      recognition.onend = null;
      recognition.onresult = null;
      recognition.onerror = null;

      try {
        recognition.stop();
      } catch (error) {
        console.log("Microphone already stopped");
      }
    }

    setVoiceModeEnabled(false);
  }, []);

  // Enable Deaf Mode.
  const enableDeafMode = useCallback(() => {
    localStorage.setItem("accessibilityMode", "deaf");
    localStorage.setItem("voiceEnabled", "false");
    localStorage.setItem("voiceChoice", "disabled");

    stopVoice();

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setShowPopup(false);
    setInactiveTime(0);
    navigate("/deaf-mode");
  }, [navigate, stopVoice]);

  // Speak only when Blind Mode is enabled.
  const speakResponse = useCallback((text) => {
    if (
      localStorage.getItem("accessibilityMode") !== "blind" ||
      localStorage.getItem("voiceEnabled") !== "true" ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 0.9;

    window.speechSynthesis.speak(speech);
  }, []);

  // Announce each page after navigation.
  useEffect(() => {
    if (
      !voiceModeEnabled ||
      localStorage.getItem("accessibilityMode") !== "blind" ||
      localStorage.getItem("voiceEnabled") !== "true"
    ) {
      return;
    }

    // LessonList manages its own voice behavior.
    if (isStudentPage(pathname)) {
      lastAnnouncedPathRef.current = pathname;
      return;
    }

    if (lastAnnouncedPathRef.current === pathname) {
      return;
    }

    lastAnnouncedPathRef.current = pathname;

    const pageNames = {
      "/": "Home",
      "/about": "About",
      "/mycourses": "My Courses",
      "/login": "Login",
      "/register": "Register",
      "/deaf-mode": "Deaf Mode",
    };

    let pageName = pageNames[pathname];

    if (!pageName && pathname.startsWith("/quiz/")) {
      pageName = "Quiz";
    }

    if (!pageName && pathname.startsWith("/admin")) {
      pageName = "Admin";
    }

    if (!pageName) {
      pageName = "Page";
    }

    speakResponse(`${pageName} page loaded`);
  }, [pathname, voiceModeEnabled, speakResponse]);

  // Start global voice commands outside student/lesson pages.
  const startVoiceCommands = useCallback(() => {
    const currentPath = window.location.pathname;

    if (
      isStudentPage(currentPath) ||
  isQuizPage(currentPath) ||
  !voiceModeRef.current ||
  localStorage.getItem("accessibilityMode") !== "blind" ||
  localStorage.getItem("voiceEnabled") !== "true"
    ) {
      return;
    }

    if (recognitionRef.current) return;

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech recognition is not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      if (
        !voiceModeRef.current ||
        localStorage.getItem("accessibilityMode") !== "blind" ||
        localStorage.getItem("voiceEnabled") !== "true"
      ) {
        return;
      }

      const result =
        event.results[event.results.length - 1][0].transcript
          .toLowerCase()
          .trim();

      console.log("Voice command:", result);

      if (
        result.includes("disable voice") ||
        result.includes("deaf mode")
      ) {
        enableDeafMode();
            } else if (
        result.includes("start lessons") ||
        result.includes("start lesson") ||
        result.includes("open lessons") ||
        result.includes("open courses")
      ) {
        speakResponse("Opening your registered course");
        navigate("/student/ai_ml_course");
      }
       else if (
        result.includes("my courses") ||
        result.includes("my course") ||
        result.includes("mycourses")
      ) {
        navigate("/mycourses");
      } else if (result.includes("about")) {
        navigate("/about");
      } else if (result.includes("home")) {
        navigate("/");
      } else if (result.includes("login")) {
        navigate("/login");
      } else if (
        result.includes("register") ||
        result.includes("registration")
      ) {
        navigate("/register");
      } else if (result.includes("quiz")) {
        speakResponse(
          "You are asking to open the quiz. Please open a lesson quiz from your course."
        );
      }
    };

    recognition.onend = () => {
      if (recognitionRef.current !== recognition) return;

      const shouldRestart =
        !isStudentPage(window.location.pathname) &&
        window.location.pathname !== "/login" &&
        voiceModeRef.current &&
        localStorage.getItem("accessibilityMode") === "blind" &&
        localStorage.getItem("voiceEnabled") === "true";

      if (shouldRestart) {
        try {
          recognition.start();
        } catch (error) {
          console.log("Recognition restart skipped", error);
        }
      }
    };

    recognition.onerror = (event) => {
      console.log("Voice error:", event.error);
    };

    try {
      recognition.start();
    } catch (error) {
      console.log("Could not start microphone", error);
    }
  }, [enableDeafMode, navigate, speakResponse]);

  // Enable Blind/Voice Mode.
  const enableVoice = useCallback(async () => {
    localStorage.setItem("accessibilityMode", "blind");
    localStorage.setItem("voiceEnabled", "true");
    localStorage.setItem("voiceChoice", "enabled");

    voiceModeRef.current = true;
    setVoiceModeEnabled(true);
    setShowPopup(false);
    setInactiveTime(0);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    try {
      if (typeof startVoiceLogin === "function") {
        await startVoiceLogin();
      }

      if (!isStudentPage(window.location.pathname)) {
        startVoiceCommands();
      }
    } catch (error) {
      console.log("Could not enable voice mode", error);
    }
  }, [startVoiceLogin, startVoiceCommands]);

  // Inactivity timer when no accessibility mode is active.
  useEffect(() => {
    if (
      voiceModeEnabled ||
      localStorage.getItem("accessibilityMode") === "deaf"
    ) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setInactiveTime((time) => time + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [voiceModeEnabled]);

  // Reset inactivity when the user interacts with the page.
  useEffect(() => {
    const resetTimer = () => {
      if (
        !voiceModeRef.current &&
        localStorage.getItem("accessibilityMode") !== "deaf"
      ) {
        setInactiveTime(0);
      }
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("keydown", resetTimer);

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, []);

  // Show accessibility popup after 10 seconds.
  useEffect(() => {
    if (
      inactiveTime >= 10 &&
      !voiceModeEnabled &&
      !showPopup &&
      localStorage.getItem("accessibilityMode") !== "deaf"
    ) {
      setShowPopup(true);
    }
  }, [inactiveTime, voiceModeEnabled, showPopup]);

  // Manage the global microphone when the route changes.
  useEffect(() => {
    const isBlindMode =
      localStorage.getItem("accessibilityMode") === "blind" &&
      localStorage.getItem("voiceEnabled") === "true";

    if (!voiceModeEnabled || !isBlindMode) return;

    if (isStudentPage(pathname) ||  isQuizPage(pathname) || pathname === "/login") {
      const recognition = recognitionRef.current;
      recognitionRef.current = null;

      if (recognition) {
        recognition.onend = null;
        recognition.onresult = null;
        recognition.onerror = null;

        try {
          recognition.stop();
        } catch (error) {
          console.log("Global microphone already stopped");
        }
      }

      return;
    }

    startVoiceCommands();
  }, [pathname, voiceModeEnabled, startVoiceCommands]);

  // Keyboard shortcuts: 1 = Voice Mode, 2 = Deaf Mode.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.repeat ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey
      ) {
        return;
      }

      const tag = event.target?.tagName;

      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(tag) ||
        event.target?.isContentEditable
      ) {
        return;
      }

      if (event.key === "2") {
        event.preventDefault();
        enableDeafMode();
      } else if (event.key === "1" && showPopup) {
        event.preventDefault();
        enableVoice();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showPopup, enableVoice, enableDeafMode]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      const recognition = recognitionRef.current;
      recognitionRef.current = null;

      if (recognition) {
        recognition.onend = null;
        recognition.onresult = null;
        recognition.onerror = null;

        try {
          recognition.stop();
        } catch (error) {
          console.log("Microphone cleanup:", error);
        }
      }

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <>
      {showPopup && (
        <div
          role="dialog"
          aria-labelledby="accessibility-title"
          aria-modal="true"
          style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            color: "black",
            padding: "20px",
            borderRadius: "10px",
            border: "2px solid black",
            zIndex: 9999,
            width: "300px",
            maxWidth: "90%",
            textAlign: "center",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          }}
        >
          <h2 id="accessibility-title">Accessibility Assistance</h2>
          <p>Choose your accessibility mode.</p>

          <button type="button" onClick={enableVoice}>
            1 — Voice Mode
          </button>

          <button type="button" onClick={enableDeafMode}>
            2 — Deaf Mode
          </button>
        </div>
      )}
    </>
  );
}

export default VoiceAssistant;
