import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import Flashcards from './Flashcards.jsx';

ReactDOM.render(
  <>
    <h1>Italian Flashcards</h1>
    <Flashcards/>
  </>,
  document.getElementById('root'));
