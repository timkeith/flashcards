import React from 'react';
import { MAX_SCORE, SCORES } from './Config';

const ScoreTable = ({ scores, questions }) => {
  const rows = SCORES.map((i) => ([]));
  scores.map((s, i) => rows[s].push(questions[i]));
  return (
    <div id='ScoreTable'>
      <table>
        <tbody>
          <tr><td className='level' colSpan='2'>Knowledge level:</td></tr>
          {
            rows.reverse().map((row, i) => (
                <tr key={i}>
                  <td className='level'>Level&nbsp;{MAX_SCORE - i}:</td>
                  <td>
                  {
                    row.map((word, j) => (
                      <span key={j} className='nowrap'>{(j > 0 ? ", " : "") + word}</span>
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
