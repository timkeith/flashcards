import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Util from './Util.js';

const Checkbox = ({ label, isChecked, onChange }) => (
  <div className='Checkbox'>
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
      <Button
        variant='primary'
        disabled={getSelected().length === 0}
        onClick={handleBegin}>
        Begin
      </Button>
      <label className='reverse-checkbox'>
        <input
          type='checkbox'
          name='reverse'
          checked={reverseQAndA}
          onChange={() => set_reverseQAndA(!reverseQAndA)}
        />
        Reverse questions and answers
      </label>
    </div>
  </>;
}

export default DeckPicker;
