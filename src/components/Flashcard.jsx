import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

export default function Flashcard(props) {
  const [showAnswer, set_showAnswer] = useState('');
  const { question, answer, doEvaluation } = props;
  const evaluations = [
    { delta: -1, variant: 'danger',  title: 'Not at all' },
    { delta:  0, variant: 'warning', title: 'A little' },
    { delta: +1, variant: 'success', title: 'Very well' },
  ];

  return (
    <div id='Flashcard'>
      <div>
        <div className='language'>Domanda:</div>
        <div className='word'>{question}</div>
      </div>
      <div>
        <div className='language'>Riposta:</div>
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
              variant={e.variant}
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
