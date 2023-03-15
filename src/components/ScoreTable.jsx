import React from 'react';
import Util from './Util.js';
import ProgressBar from 'react-bootstrap/ProgressBar';

const ScoreTable = ({ scores, questions }) => {
  const rows = Array.from(Array(Util.MAX_SCORE+1)).map(() => []);
  scores.map((s, i) => rows[s].push(questions[i]));
  const overall = Math.floor(scores.reduce((result, s, index) => {
    return result + Math.max(s - 1, 0);
  }, 0) * 100 / 3 / questions.length + .5);
  return (
    <div id='ScoreTable'>
      <ProgressBar
        now={overall}
        label={`${overall}%`}
      />
      <table>
        <tbody>
          {/*
          <tr><td className='level' colSpan='2'>
            Knowledge level: {Math.floor(overall + .5)}%
          </td></tr>
          */}
          {
            rows.reverse().map((row, i) => (
                <tr key={i}>
                  <td className='level'>Level&nbsp;{rows.length - 1 - i}:</td>
                  <td>
                  {
                    row.map((word, j) => (
                      <span key={j} className='nowrap'>{(j > 0 ? ', ' : '') + word}</span>
                    ))
                  }
                  </td>
                </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default ScoreTable;
