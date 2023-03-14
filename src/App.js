import React, { Component } from 'react';
import DeckPicker from './components/DeckPicker';
import ScoreTable from './components/ScoreTable';
import Flashcard from './components/Flashcard';
import { MAX_SCORE, SCORES } from './components/Config';
import Words from './data/words.js';

const SCALE = 4;  // each bucket is SCALE times as likely as the next

// Pick a word at random
const pickWord = (buckets, scores) => {
  const count = buckets.map((n, i) => (n * SCALE**(MAX_SCORE - i)));
  const sum = count.reduce((x, y) => x + y, 0);
  const prob = count.map((n) => (n / sum));
  var r = Math.random();
  console.log('r:', r, '  prob:', prob);
  var s = 0;
  for (; s < buckets.length; ++s) {
    r -= prob[s];
    if (r < 0) break;
  }
  var j = Math.floor(Math.random() * buckets[s]);
  var currentWord;
  for (var i = 0; i < scores.length; ++i) {
    if (scores[i] === s) {
      if (j === 0) {
        currentWord = i;
        break;
      }
      j -= 1;
    }
  }
  //console.log('currentWord:', currentWord);
  if (currentWord === undefined) {
    console.log('currentWord undefined');
    console.log(`want element ${j} of ${buckets[s]} from bucket ${s}`);
  }
  return currentWord;
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      haveBegun: false,
      questions: [],  // i -> question in lang1
      answers:   [],  // i -> answer in lang2
      scores:    [],  // i -> score for that pair
      buckets:   [],  // score -> number with that score
    };
  }

  doEvaluation = (delta) => {
    let scores = [...this.state.scores];
    const oldScore = scores[this.state.currentWord];
    const newScore = Math.max(0, Math.min(MAX_SCORE, oldScore + delta));
    scores[this.state.currentWord] = newScore;
    let buckets = [...this.state.buckets];
    buckets[oldScore] -= 1;
    buckets[newScore] += 1;
    const currentWord = pickWord(buckets, scores);
    this.setState({ currentWord: currentWord, scores: scores, buckets: buckets });
  };

  doBegin = (decks, reverse) => {
    const d1 = reverse ? 1 : 0;
    const d2 = reverse ? 0 : 1;
    var questions = [];
    var answers = [];
    var scores = [];
    for (var j = 0; j < decks.length; ++j) {
      const list = Words[decks[j]];
      for (var i = 0; i < list.length; i += 2) {
        questions.push(list[i+d1]);
        answers.push(list[i+d2]);
        scores.push(0);
      }
    }
    var buckets = [...SCORES];
    buckets[0] = questions.length;
    this.setState({
      haveBegun:   true,
      decks:       decks,
      questions:   questions,
      answers:     answers,
      scores:      scores,
      buckets:     buckets,
      currentWord: Math.floor(Math.random() * questions.length),
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
