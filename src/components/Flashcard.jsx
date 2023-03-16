import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

class Flashcard extends Component {
  state = {
    showAnswer: false,
  };

  doEvaluation = (v) => {
    this.setState({showAnswer: false});
    this.props.doEvaluation(v);
  };

  render() {
    const { question, answer } = this.props;
    const evaluations = [
      { delta: -1, variant: 'danger',  title: 'Not at all' },
      { delta:  0, variant: 'warning', title: 'A little' },
      { delta: +1, variant: 'success', title: 'Very well' },
    ];

    return (
      <div id='Flashcard'>
        <div>
          <div className='language'>Domanda:</div>
          <div className='word'>{question}</div>
        </div>
        <div>
          <div className='language'>Riposta:</div>
          <div className='word' hidden={!this.state.showAnswer}>
            {answer}
          </div>
        </div>
        <div className='evaluate'>
          <div className='language' hidden={this.state.showAnswer}>
          </div>
          <div className='word' hidden={this.state.showAnswer}>
            <Button
              variant='primary'
              onClick={() => { this.setState({showAnswer: true}) }}>
              Show
            </Button>
          </div>
          <div className='language' hidden={!this.state.showAnswer}>
            <div className='smaller'>How well did you know it?</div>
          </div>
          <div className='word' hidden={!this.state.showAnswer}>
            {evaluations.map((e) => (
              <Button
                key={e.delta}
                variant={e.variant}
                title={e.title}
                onClick={() => { this.doEvaluation(e.delta); }}>
                {e.delta > 0 ? "+" : e.delta < 0 ? "-" : "0"}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Flashcard;
