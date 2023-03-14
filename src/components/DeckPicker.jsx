import React, { Component } from 'react';

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

class DeckPicker extends Component {

  constructor(props) {
    super(props);
    var decks = {};
    for (const deck in props.words) {
      decks[deck] = false;
    }
    this.state = {
      decks: decks,
      reverseQAndA: false,
    };
  }

  handleChange(key) {
    return () => {
      var decks = this.state.decks;
      decks[key] = !decks[key];
      this.setState({ decks: decks });
    }
  }

  handleSelectAll = () => {
    var decks = {};
    for (const deck in this.state.decks) {
      decks[deck] = true;
    }
    this.setState({ decks: decks });
  }

  handleSelectDeselectAll(selected) {
    return () => {
      var decks = {};
      for (const deck in this.state.decks) {
        decks[deck] = selected;
      }
      this.setState({ decks: decks });
    };
  }

  areAnyChecked() {
    for (const deck in this.state.decks) {
      if (this.state.decks[deck]) return true;
    }
    return false;
  }

  getSelected() {
    var result = [];
    for (const deck in this.state.decks) {
      if (this.state.decks[deck]) result.push(deck);
    }
    return result;
  }

  handleBegin = () => {
    this.props.doBegin(this.getSelected(), this.state.reverseQAndA);
  };

  render() {
    return (
      <div id='DeckPicker'>
        <h1>Choose Decks to Study</h1>
        <button
          className='btn btn-primary m-2'
          onClick={this.handleSelectDeselectAll(true)}>
          Select All
        </button>
        <button
          className='btn btn-primary m-2'
          onClick={this.handleSelectDeselectAll(false)}>
          Deselect All
        </button>
        {
          Object.entries(this.state.decks).map((x) => (
            <Checkbox
              label={x[0]}
              key={x[0]}
              isChecked={x[1]}
              onChange={this.handleChange(x[0])}
            />
          ))
        }
        <button
          className='btn btn-primary m-2'
          disabled={!this.areAnyChecked()}
          onClick={this.handleBegin}>
          Begin
        </button>
        <label className='reverse-checkbox'>
          <input
            type='checkbox'
            name='reverse'
            checked={this.state.reverseQAndA}
            onChange={() => { this.setState({ reverseQAndA: !this.state.reverseQAndA}) }}
          />
          Reverse questions and answers
        </label>
      </div>
    );
  }

}

export default DeckPicker;
