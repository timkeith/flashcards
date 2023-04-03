import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

const evaluations = [
  { delta: -1, title: 'Not at all' },
  { delta:  0, title: 'A little' },
  { delta: +1, title: 'Very well' },
];

export default function Flashcard({ question, answer, doEvaluation }) {
  const [showAnswer, set_showAnswer] = useState('');
  return (
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
            onClick={() => { set_showAnswer(true); }}>
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
              onClick={() => { set_showAnswer(false); doEvaluation(e.delta); }}>
              {e.delta > 0 ? '+' : e.delta < 0 ? '-' : '0'}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
