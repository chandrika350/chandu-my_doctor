import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { ClipLoader } from "react-spinners";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faPlay, faPause, faRedo, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import loadingGif from './assets/Loading.gif';
import backgroundGif from './assets/bujji3.gif';
import './styles.css';

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSynthesisUtterance, setSpeechSynthesisUtterance] = useState(null);

  const API_KEY = "AIzaSyBhuYRkdE9ULfxl3w0iDkrOLGkbt7_zUHc";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

  useEffect(() => {
    const greetUser = () => {
      const greetingMessage = "Hi, this is My Doctor. How can I assist you with your health today?";
      speakText(greetingMessage);
    };
    greetUser();
  }, []);

  const generateAnswer = async (e) => {
    e.preventDefault();
    setGeneratingAnswer(true);
    setAnswer("Fetching information... Please wait.");
    setShowResults(false);

    try {
      const response = await axios.post(API_URL, {
        contents: [{ parts: [{ text: question }] }],
      });

      const generatedAnswer = response.data.candidates[0].content.parts[0].text;
      setAnswer(generatedAnswer);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAnswer("Sorry, something went wrong. Please try again.");
    } finally {
      setGeneratingAnswer(false);
      setShowResults(true);
    }
  };

  const startVoiceRecognition = () => {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition API is not supported in this browser.');
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Voice recognition started. Speak now.');
    };

    recognition.onresult = (event) => {
      console.log('Recognition result:', event.results);
      if (event.results.length > 0) {
        const speechToText = event.results[0][0].transcript;
        console.log('Speech to text:', speechToText);
        setQuestion(speechToText);
      } else {
        console.log('No results from recognition');
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      console.log('Voice recognition ended.');
    };

    recognition.start();
  };

  const speakText = (text, lineByLine = false) => {
    if (isPlaying) return;

    const utterance = new SpeechSynthesisUtterance();
    utterance.lang = 'en-US';
    utterance.text = text;
    setSpeechSynthesisUtterance(utterance);
    setIsPlaying(true);

    if (lineByLine) {
      const lines = text.split('\n');
      let currentLine = 0;
      const speakNextLine = () => {
        if (currentLine < lines.length) {
          utterance.text = lines[currentLine];
          utterance.onend = speakNextLine;
          speechSynthesis.speak(utterance);
          currentLine++;
        } else {
          setIsPlaying(false);
        }
      };
      speakNextLine();
    } else {
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    }
  };

  const handlePlayResponse = () => {
    speakText(answer, true);
  };

  const handlePauseResponse = () => {
    if (speechSynthesisUtterance) {
      speechSynthesis.pause();
      setIsPlaying(false);
    }
  };

  const handleRestart = () => {
    setQuestion("");
    setAnswer("");
    setGeneratingAnswer(false);
    setShowResults(false);
    setIsPlaying(false);
    setSpeechSynthesisUtterance(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateAnswer(e);
    }
  };

  return (
    <div className="app-container">
      <img src={backgroundGif} alt="Background" className="background-gif" />
      {generatingAnswer && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-30">
          <img src={loadingGif} alt="Loading" className="w-full h-full object-cover" />
        </div>
      )}
      <form onSubmit={generateAnswer} className="main-form-container">
        <h1 className="text-6xl font-bold text-red-500 mb-7 animate-bounce">My Doctor</h1>
        <div className="relative">
          <textarea
            required
            className="border border-gray-300 rounded w-full my-2 min-h-fit p-3 transition-all duration-300 focus:border-red-400 focus:shadow-lg"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything about health"
            style={{ resize: 'none', minHeight: '100px', padding: '10px' }}
          ></textarea>
          <button
            type="button"
            onClick={startVoiceRecognition}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
            aria-label="Start Voice Recognition"
          >
            <FontAwesomeIcon icon={faMicrophone} size="lg" />
          </button>
          <button
            type="submit"
            className="absolute right-3 top-10 transform text-gray-600 hover:text-gray-900"
          >
            <FontAwesomeIcon icon={faArrowRight} size="lg" />
          </button>
        </div>
        {showResults && (
          <div className="response-container">
            <h2 className="text-xl font-semibold mb-3">Response:</h2>
            <ReactMarkdown>{answer}</ReactMarkdown>
            <div className="flex justify-center space-x-2 mt-4">
              <button
                onClick={handlePlayResponse}
                className={`bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-all duration-300 ${isPlaying ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isPlaying}
              >
                <FontAwesomeIcon icon={faPlay} size="lg" />
              </button>
              <button
                onClick={handlePauseResponse}
                className={`bg-gray-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-600 transition-all duration-300 ${!isPlaying ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={!isPlaying}
              >
                <FontAwesomeIcon icon={faPause} size="lg" />
              </button>
              <button
                onClick={handleRestart}
                className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faRedo} size="lg" />
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default App;
