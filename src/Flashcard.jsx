import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

const evaluations = [
  { delta: -1, title: 'Not at all', keys: ['-', '_'] },
  { delta:  0, title: 'A little',   keys: ['0']      },
  { delta: +1, title: 'Very well',  keys: ['+', '='] },
];

const Flashcard = ({ question, answer, doEvaluation }) => {
  const [showAnswer, set_showAnswer] = useState('');
  const showAction = () => set_showAnswer(true);
  const evalAction = (e) => {
    set_showAnswer(false);
    doEvaluation(e.delta);
  };
  const handleKeyPress = (event) => {
    const key = event.key;
    if (showAnswer) {
      evaluations.map((e) => e.keys.includes(key) && evalAction(e));
    } else if (key === 's' || key === 'S' || key === 'Enter') {
      showAction();
    }
  };
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
  return <>
    <div id='Flashcard'>
      <div>
        <div className='language'>Domanda:</div>
        <div className='word'>{question}</div>
      </div>
      <div>
        <div className='language'>Risposta:</div>
        <div className='word' hidden={!showAnswer}>
          {answer}
        </div>
      </div>
      <div className='evaluate'>
        <div className='language' hidden={showAnswer}>
        </div>
        <div className='word' hidden={showAnswer}>
          <Button
            variant='primary'
            onClick={showAction}>
            Show
          </Button>
        </div>
        <div className='language' hidden={!showAnswer}>
          <div className='smaller'>How well did you know it?</div>
        </div>
        <div className='word' hidden={!showAnswer}>
          {evaluations.map((e) => (
            <Button
              key={e.delta}
              title={e.title}
              onClick={() => evalAction(e)}>
              {e.keys[0]}
            </Button>
          ))}
        </div>
      </div>
    </div>
  </>;
};

export default Flashcard;
