import {
  useEffect,
  useState,
  useRef
} from "react";

function VoiceAssistant({

  startVoiceLogin,

  navigate

}) {

  const [

    inactiveTime,

    setInactiveTime

  ] = useState(0);

  const [

    showPopup,

    setShowPopup

  ] = useState(false);

  const [

    voiceModeEnabled,

    setVoiceModeEnabled

  ] = useState(false);

  const timerRef =
    useRef(null);

  const recognitionRef =
    useRef(null);

  // ---------------------------------
  // START INACTIVITY TIMER
  // ---------------------------------

  useEffect(() => {

    if (voiceModeEnabled)
      return;

    timerRef.current =

      setInterval(() => {

        setInactiveTime(
          (prev) => prev + 1
        );

      }, 1000);

    return () =>

      clearInterval(
        timerRef.current
      );

  }, [voiceModeEnabled]);

  // ---------------------------------
  // RESET TIMER ON USER ACTIVITY
  // ---------------------------------

  useEffect(() => {

    const resetTimer = () => {

      if (!voiceModeEnabled) {

        setInactiveTime(0);

      }

    };

    window.addEventListener(
      "mousemove",
      resetTimer
    );

    window.addEventListener(
      "keydown",
      resetTimer
    );

    window.addEventListener(
      "click",
      resetTimer
    );

    return () => {

      window.removeEventListener(
        "mousemove",
        resetTimer
      );

      window.removeEventListener(
        "keydown",
        resetTimer
      );

      window.removeEventListener(
        "click",
        resetTimer
      );

    };

  }, [voiceModeEnabled]);

  // ---------------------------------
  // SHOW POPUP AFTER INACTIVITY
  // ---------------------------------

  useEffect(() => {

    if (

      inactiveTime >= 10 &&

      !voiceModeEnabled &&

      !showPopup

    ) {

      setShowPopup(true);

  //     speakResponse(
  //   "We noticed you may need help. Press one to enable voice assistance or press two to continue normally."
  // );
      speakResponse();

    }

  }, [

    inactiveTime,

    voiceModeEnabled,

    showPopup

  ]);

  // ---------------------------------
  // SPEAK RESPONSE
  // ---------------------------------

  const speakResponse = (text) => {

    window.speechSynthesis.cancel();

    const speech =

      new SpeechSynthesisUtterance(
        text
      );

    speech.rate = 0.9;

    speech.lang = "en-US";

    window.speechSynthesis.speak(
      speech
    );

  };

  // ---------------------------------
  // START VOICE COMMANDS
  // ---------------------------------

  const startVoiceCommands = () => {

    const SpeechRecognition =

      window.SpeechRecognition ||

      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

      alert(
        "Speech Recognition not supported"
      );

      return;

    }

    // STOP OLD RECOGNITION

    if (recognitionRef.current) {

      recognitionRef.current.stop();

    }

    const recognition =
      new SpeechRecognition();

    recognitionRef.current =
      recognition;

    recognition.continuous = true;

    recognition.interimResults =
      false;

    recognition.lang = "en-US";

    // START MIC

    recognition.start();

    console.log(
      "Voice Recognition Started"
    );

    // ---------------------------------
    // LISTEN COMMANDS
    // ---------------------------------

    recognition.onresult = (
      event
    ) => {

      const command =

        event.results[
          event.results.length - 1
        ][0].transcript
          .toLowerCase()
          .trim();

      console.log(
        "COMMAND:",
        command
      );

      // LESSONS

      if (
        command.includes("lesson")
      ) {

        speakResponse(
          "Opening lessons page"
        );

        navigate("/lessons");

      }

      // COURSES

      else if (

        command.includes("course") ||

        command.includes("courses") ||

        command.includes("my course") ||

        command.includes("my courses") ||

        command.includes("mycourses")

      ) {

        speakResponse(
          "Opening my courses page"
        );

        navigate("/mycourses");

      }

      // QUIZ

      else if (
        command.includes("quiz")
      ) {

        speakResponse(
          "Opening quiz page"
        );

        navigate("/quiz");

      }

      // HOME

      else if (
        command.includes("home")
      ) {

        speakResponse(
          "Opening home page"
        );

        navigate("/");

      }

      // LOGIN

      else if (
        command.includes("login")
      ) {

        speakResponse(
          "Opening login page"
        );

        navigate("/login");

      }

      // REGISTER

      else if (

  command.includes("register") ||

  command.includes("registration") ||

  command.includes(" go to register page") ||

  command.includes("go to register")

) {
  console.log("REGISTER BLOCK HIT")

  speakResponse(
    "Opening register page"
  );

  navigate("/register");

}

      // LOGOUT

      else if (
        command.includes("logout")
      ) {

        speakResponse(
          "Logging out"
        );

        localStorage.clear();

        navigate("/login");

      }

    };

    // ---------------------------------
    // ON END
    // ---------------------------------

    recognition.onend = () => {

      console.log(
    "Voice Recognition Restarting"
  );

  if (voiceModeEnabled) {
    recognition.start();
  }

    };

    // ---------------------------------
    // ON ERROR
    // ---------------------------------

    recognition.onerror = (
      event
    ) => {

      console.log(
        "VOICE ERROR:",
        event.error
      );

      recognition.stop();

    };

  };

  // ---------------------------------
  // ENABLE VOICE MODE
  // ---------------------------------

  const enableVoice =
    async () => {

    clearInterval(
      timerRef.current
    );

    setVoiceModeEnabled(
      true
    );

    setShowPopup(false);

    setInactiveTime(0);

    try {

      await startVoiceLogin();

      setTimeout(() => {

        startVoiceCommands();

      }, 2000);

    }

    catch (error) {

      console.log(error);

    }

  };

  // ---------------------------------
  // CONTINUE NORMAL MODE
  // ---------------------------------

  const continueNormal = () => {

    setShowPopup(false);

    setInactiveTime(0);

  };

  // ---------------------------------
  // CLEANUP
  // ---------------------------------

  useEffect(() => {

    return () => {

      if (recognitionRef.current) {

        recognitionRef.current.stop();

      }

    };

  }, []);

  return (

    <div>

      {

        showPopup && (

          <div

            style={{

              position: "fixed",

              top: "30%",

              left: "35%",

              background: "white",

              padding: "20px",

              borderRadius: "10px",

              border:
                "2px solid black",

              zIndex: "999",

              width: "300px",

              textAlign: "center",

              boxShadow:

                "0px 0px 10px rgba(0,0,0,0.3)"

            }}

          >

            <h2>

              Voice Assistance

            </h2>

            <p>

              We noticed that
              you may be
              struggling to login.

            </p>

            <button

              onClick={enableVoice}

              style={{

                marginRight: "10px",

                padding: "10px"

              }}

            >

              Press 1

            </button>

            <button

              onClick={continueNormal}

              style={{

                padding: "10px"

              }}

            >

              Press 2

            </button>

          </div>

        )

      }

    </div>

  );

}

export default VoiceAssistant;