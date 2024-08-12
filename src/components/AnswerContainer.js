import React from 'react';

const AnswerContainer = ({ answer }) => {
  return (
    <div className="answer-container">
      <h2>Generated Answer</h2>
      <p>{answer}</p>
    </div>
  );
};

export default AnswerContainer;
