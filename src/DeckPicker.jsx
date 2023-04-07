import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Util from './Util.js';

const Checkbox = ({ label, isChecked, onChange }) => (
  <div>
    <label>
      <input
        type='checkbox'
        name={label}
        checked={isChecked}
        onChange={onChange}
      />
      {label}
    </label>
  </div>
);

const DeckPicker = ({ words, doBegin }) => {
  const [decks, set_decks] = useState(Util.mapObject(words, (deck) => [deck, false]));
  const [reverseQAndA, set_reverseQAndA] = useState(false);
  const [show, set_show] = useState(false);

  const handleChange = (deck) => {
    return () => (
      set_decks(Util.mapObjectValues(decks, (d, sel) => (d === deck ? !sel : sel)))
    );
  };

  const handleSelectDeselectAll = (selected) => {
    return () => ( set_decks(Util.mapObjectValues(decks, (deck, sel) => (selected))) );
  };

  const getSelected = () => {
    return Object.keys(Util.filterObject(decks, (deck, sel) => (sel)));
  }

  const handleBegin = () => {
    doBegin(getSelected(), reverseQAndA);
  };

  return <>
    <div id='DeckPicker'>
      <h2>Choose Decks to Study</h2>
      <Button
        variant='primary'
        onClick={handleSelectDeselectAll(true)}>
        Select All
      </Button>
      <Button
        variant='primary'
        onClick={handleSelectDeselectAll(false)}>
        Deselect All
      </Button>
      <div id='DeckList'>
        {
          Util.mapObjectToArray(decks, (deck, selected) => (
            <Checkbox
              label={deck}
              key={deck}
              isChecked={selected}
              onChange={handleChange(deck)}
            />
          ))
        }
      </div>
      <div id='PostDeckList'>
        <Button
          variant='primary'
          disabled={getSelected().length === 0}
          onClick={handleBegin}>
          Study
        </Button>
        <br />
        <Checkbox
          label='Reverse questions and answers'
          isChecked={reverseQAndA}
          onChange={() => set_reverseQAndA(!reverseQAndA)} />
        <div id='ShowDecks'>
          <Checkbox
            label='Show selected decks'
            isChecked={show}
            onChange={() => set_show(!show)}
          />
          { !show ? ''
              : <ShowDecks selected={getSelected()} words={words} reverse={reverseQAndA}/> }
        </div>
      </div>
    </div>
  </>;
}

const ShowDecks = ({selected, words, reverse}) => (
  <div className='ShowDecks'> {
      selected.map((deck) => (
        <div key={deck}>
        <div className='head'>{deck}</div>
          {<ShowWords words={words[deck]} reverse={reverse}/>}
        </div>
      ))
    }
  </div>
);
    
const ShowWords = ({words, reverse}) => (
  <table>
    <tbody>
      {
        Util.range(0, words.length, 2).map((i) => (
          <tr key={i}>
            <td></td>
            <td>{words[i + (reverse ? 1 : 0)]}</td>
            <td>{words[i + (reverse ? 0 : 1)]}</td>
          </tr>
        ))
      }
    </tbody>
  </table>
);

export default DeckPicker;
