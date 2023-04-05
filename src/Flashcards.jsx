import React, { Component } from 'react';
import GroupPicker from './GroupPicker.jsx';
import DeckPicker from './DeckPicker.jsx';
import Flashcard from './Flashcard.jsx';
import ScoreTable from './ScoreTable.jsx';
import Util from './Util.js';

// Start at 1 so room to go down.
const START_SCORE = 1;

const BackButton = ({ onClick }) => {
  return <button className='back' onClick={onClick}>&lt; Back</button>;
};

class Flashcards extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error:     undefined,
      words:     undefined,  // undefined if words haven't been fetched
      group:     undefined,  // undefined if group hasn't been chosen
      decks:     undefined, // undefined if decks haven't been chosen
      questions: [],  // i -> question in lang1
      answers:   [],  // i -> answer in lang2
      scores:    [],  // i -> score for that pair
      buckets:   [],  // score -> [ indices with that score ]
    };
  }

  doEvaluation = (delta) => {
    let scores = [...this.state.scores];
    const oldScore = scores[this.state.currentWord];
    const newScore = Math.max(0, Math.min(Util.MAX_SCORE, oldScore + delta));
    scores[this.state.currentWord] = newScore;
    const buckets = Util.moveBucket(
      this.state.buckets, this.state.currentWord, oldScore, newScore);
    this.setState({
      currentWord: this.pickFromBuckets(buckets),
      scores:      scores,
      buckets:     buckets,
    });
  };

  // Don't pick the same word twice in a row
  pickFromBuckets = (buckets) => {
    for (;;) {
      const word = Util.pickFromBuckets(buckets);
      if (word !== this.state.currentWord) return word;
    }
  };

  doBegin = (decks, reverse) => {
    const d1 = reverse ? 1 : 0;
    const d2 = reverse ? 0 : 1;
    var questions = [];
    var answers = [];
    var scores = [];
    var buckets = Array.from(Array(Util.MAX_SCORE+1)).map(() => []);
    const words = this.state.words[this.state.group];
    for (var j = 0; j < decks.length; ++j) {
      const list = words[decks[j]];
      for (var i = 0; i < list.length; i += 2) {
        buckets[START_SCORE].push(questions.length);
        questions.push(list[i+d1]);
        answers.push(list[i+d2]);
        scores.push(START_SCORE);
      }
    }
    if (questions.length <= 1) {
      this.setState({error: 'More than one word must be selected'});
    } else {
      this.setState({
        decks:       decks,
        questions:   questions,
        answers:     answers,
        scores:      scores,
        buckets:     buckets,
        currentWord: Util.pickFromBuckets(buckets),
      });
    }
  };

  setGroup = (group) => {
    this.setState({group: group});
  };

  render() {
    if (this.state.error) {
      return <div class='error'>Error: {this.state.error}</div>
    } else if (this.state.words === undefined) {
      Util.fetchWords(
        (words) => this.setState({words: words}),
        (error) => this.setState({error: error}));
      return <>
        <h1>Italian Flashcards</h1>
        <div>Fetching word list...</div>
      </>;
    } else if (this.state.group === undefined) {
      return <>
        <h1>Italian Flashcards</h1>
        <GroupPicker groups={Object.keys(this.state.words)} handler={this.setGroup} />
      </>;
    } else if (this.state.decks === undefined) {
      return <>
        <BackButton onClick={() => this.setState({group: undefined})} />
        <h1>Flashcards: {this.state.group}</h1>
        <DeckPicker
          words={this.state.words[this.state.group]}
          doBegin={this.doBegin}
        />
      </>;
    } else {
      return <>
        <BackButton onClick={() => this.setState({decks: undefined})} />
        <h1>Flashcards: {this.state.group}</h1>
        <Flashcard
          question={this.state.questions[this.state.currentWord]}
          answer={this.state.answers[this.state.currentWord]}
          doEvaluation={this.doEvaluation}
        />
        <ScoreTable
          scores={this.state.scores}
          questions={this.state.questions}
        />
      </>;
    }
  }
}

export default Flashcards;
