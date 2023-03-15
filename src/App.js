import React, { Component } from 'react';
import DeckPicker from './components/DeckPicker';
import ScoreTable from './components/ScoreTable';
import Flashcard from './components/Flashcard';
import Words from './data/words.js';
import Util from './components/Util.js';

// Start at 1 so room to go down.
const START_SCORE = 1;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      haveBegun: false,
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
    for (var j = 0; j < decks.length; ++j) {
      const list = Words[decks[j]];
      for (var i = 0; i < list.length; i += 2) {
        buckets[START_SCORE].push(questions.length);
        questions.push(list[i+d1]);
        answers.push(list[i+d2]);
        scores.push(START_SCORE);
      }
    }
    this.setState({
      haveBegun:   true,
      decks:       decks,
      questions:   questions,
      answers:     answers,
      scores:      scores,
      buckets:     buckets,
      currentWord: Util.pickFromBuckets(buckets),
    });
  }

  render() {
    if (!this.state.haveBegun) {
      return (
        <DeckPicker words={Words} doBegin={this.doBegin} />
      );
    } else {
      const question = this.state.questions[this.state.currentWord];
      const answer = this.state.answers[this.state.currentWord];
      return (
        <>
          <Flashcard
            question={question}
            answer={answer}
            doEvaluation={this.doEvaluation}
          />
          <ScoreTable
            scores={this.state.scores}
            questions={this.state.questions}
          />
        </>
      );
    }
  }
}

export default App;
