import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

const VoiceButton = ({ setQuestion }) => {
  const startVoiceRecognition = () => {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition API is not supported in this browser.');
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setQuestion(speechToText);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
  };

  return (
    <button
      type="button"
      onClick={startVoiceRecognition}
      aria-label="Start Voice Recognition"
    >
      <FontAwesomeIcon icon={faMicrophone} size="lg" />
    </button>
  );
};

export default VoiceButton;
