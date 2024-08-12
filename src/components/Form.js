import React from 'react';
import VoiceButton from './VoiceButton';

const Form = ({ question, setQuestion, generateAnswer, generatingAnswer }) => {
  return (
    <form onSubmit={generateAnswer}>
      <h1>My Doctor</h1>
      <textarea
        required
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask about your health issue or problem..."
      />
      <div className="form-actions">
        <VoiceButton setQuestion={setQuestion} />
        <button type="submit" disabled={generatingAnswer}>
          {generatingAnswer ? "Generating..." : "Generate Answer"}
        </button>
      </div>
    </form>
  );
};

export default Form;
