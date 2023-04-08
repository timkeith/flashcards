import React, { useState } from 'react';
import GroupPicker from './GroupPicker.jsx';
import DeckPicker from './DeckPicker.jsx';
import Flashcard from './Flashcard.jsx';
import ScoreTable from './ScoreTable.jsx';
import Util from './Util.js';

// Start at 1 so room to go down.
const START_SCORE = 1;

const Flashcards = () => {

  const [error,     set_error]     = useState();
  const [words,     set_words]     = useState();   // undefined if words haven't been fetched
  const [group,     set_group]     = useState();   // undefined if group hasn't been chosen
  const [decks,     set_decks]     = useState();   // undefined if decks haven't been chosen
  const [questions, set_questions] = useState([]); // i -> question in lang1
  const [answers,   set_answers]   = useState([]); // i -> answer in lang2

  const doBegin = (selectedDecks, reverse) => {
    var questions = [];
    var answers = [];
    const wordGroup = words[group];
    for (var j = 0; j < selectedDecks.length; ++j) {
      const list = wordGroup[selectedDecks[j]];
      for (var i = 0; i < list.length; i += 2) {
        questions.push(list[i]);
        answers.push(list[i+1]);
      }
    }
    if (questions.length <= 1) {
      set_error('More than one word must be selected');
    } else {
      set_decks(selectedDecks);
      set_questions(reverse ? answers : questions);
      set_answers(reverse ? questions : answers);
    }
  };

  if (error) {
    return <div class='error'>Error: {error}</div>
  } else if (words === undefined) {
    Util.fetchWords(
      (words) => set_words(words),
      (error) => set_error(error));
    return <>
      <h1>Italian Flashcards</h1>
      <div>Fetching word list...</div>
    </>;
  } else if (group === undefined) {
    return <>
      <h1>Italian Flashcards</h1>
      <GroupPicker groups={Object.keys(words)} handler={set_group} />
    </>;
  } else if (decks === undefined) {
    return <>
      <BackButton onClick={() => set_group(undefined)} />
      <h1>Flashcards: {group}</h1>
      <DeckPicker words={words[group]} doBegin={doBegin} />
    </>;
  } else {
    return <FlashcardPage
      questions={questions}
      answers={answers}
      onBack={() => set_decks(undefined)}
    />;
  }
};

const FlashcardPage = ({ group, questions, answers, onBack }) => {
  const [scores,   set_scores]   = React.useState([]); // i -> score for that pair
  const [buckets,  set_buckets]  = React.useState([]); // score -> [ indices with that score ]
  const [currWord, set_currWord] = React.useState(0);

  React.useEffect(() => {
    const buckets0 = Util.range(0, Util.MAX_SCORE+1).map(
      (i) => (i === START_SCORE ? Util.range(0, questions.length) : []));
    set_buckets(buckets0);
    set_scores(Util.range(0, questions.length).map(() => START_SCORE));
    set_currWord(Util.pickFromBuckets(buckets0));
  }, []);

  const doEvaluation = (delta) => {
    let newScores = [...scores];
    const oldScore = newScores[currWord];
    const newScore = Math.max(0, Math.min(Util.MAX_SCORE, oldScore + delta));
    newScores[currWord] = newScore;
    const newBuckets = Util.moveBucket(buckets, currWord, oldScore, newScore);
    set_currWord(pickFromBuckets(newBuckets));
    set_scores(newScores);
    set_buckets(newBuckets);
  };

  // Don't pick the same word twice in a row
  const pickFromBuckets = (buckets) => {
    for (;;) {
      const word = Util.pickFromBuckets(buckets);
      if (word !== currWord) {
        return word;
      }
    }
  };

  return <>
    <BackButton onClick={onBack} />
    <h1>Flashcards: {group}</h1>
    <Flashcard
      question={questions[currWord]}
      answer={answers[currWord]}
      doEvaluation={doEvaluation}
    />
    <ScoreTable scores={scores} questions={questions} />
  </>;
};

const BackButton = ({ onClick }) => {
  return <button className='back' onClick={onClick}>&lt; Back</button>;
};

export default Flashcards;
