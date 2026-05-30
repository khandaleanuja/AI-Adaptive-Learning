import "./About.css";
import { useEffect, useState } from "react";
import {
  FaBrain,
  FaMicrophone,
  FaBookOpen,
  FaChartLine,
  FaUniversalAccess,
  FaShieldAlt,
  FaBullseye,
} from "react-icons/fa";

const images = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200",
];

function AboutPage() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {

  const voiceChoice =
    localStorage.getItem("voiceChoice");

  if (voiceChoice !== "enabled") return;

  const aboutSpeech =
    new SpeechSynthesisUtterance(

      "Welcome to Adaptive AI Learning Platform. " +

      "Adaptive AI Learning Platform is designed to provide personalized learning experiences for every learner. " +

      "The system adapts according to user behavior, accessibility needs and learning patterns. " +

      "Our mission is to make education accessible, inclusive and affordable for everyone through Artificial Intelligence. " +

      "Key features include AI recommendations, adaptive learning, voice learning, accessibility support, progress tracking and secure platform."

    );

  aboutSpeech.rate = 0.9;
  aboutSpeech.lang = "en-US";

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(aboutSpeech);

}, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);



  return (
    <div className="about-page">

      {/* Top Section */}
      <div className="top-section">

        <div className="slider-card">
          <img
            src={images[currentImage]}
            alt="Learning Platform"
            className="slider-image"
          />

          <div className="dots">
            {images.map((_, index) => (
              <span
                key={index}
                className={currentImage === index ? "dot active" : "dot"}
              />
            ))}
          </div>
        </div>

        <div className="about-card">
          <span className="badge">About Us</span>

          <h1>
            About Our <span>Platform</span>
          </h1>

          <p>
            Adaptive AI Learning Platform is designed to provide
            personalized learning experiences for every learner.
          </p>

          <p>
            The system adapts according to user behavior,
            accessibility needs and learning patterns to deliver
            content through text, audio and video formats.
          </p>

          <button className="start-btn">
            Start Learning
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">

        <div className="mission-card">
          <div className="icon-circle">
            <FaBullseye />
          </div>

          <h2>Our Mission</h2>

          <p>
            To make education accessible, inclusive and affordable
            for everyone through Artificial Intelligence.
            We empower learners of all abilities to grow and
            succeed in a supportive environment.
          </p>
        </div>

        <div className="features-card">

          <h2>Key Features</h2>

          <div className="feature-grid">

            <div className="feature-box">
              <FaBrain />
              <h4>AI Recommendations</h4>
              <p>Smart course suggestions.</p>
            </div>

            <div className="feature-box">
              <FaBookOpen />
              <h4>Adaptive Learning</h4>
              <p>Personalized content delivery.</p>
            </div>

            <div className="feature-box">
              <FaMicrophone />
              <h4>Voice Learning</h4>
              <p>Speech assisted learning.</p>
            </div>

            <div className="feature-box">
              <FaUniversalAccess />
              <h4>Accessibility</h4>
              <p>Support for all learners.</p>
            </div>

            <div className="feature-box">
              <FaChartLine />
              <h4>Progress Tracking</h4>
              <p>Track performance easily.</p>
            </div>

            <div className="feature-box">
              <FaShieldAlt />
              <h4>Secure Platform</h4>
              <p>Protected and reliable.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default AboutPage;