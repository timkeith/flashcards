import React, { Component } from 'react';

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
      { delta: -1, className: 'btn-danger',  title: 'Not at all' },
      { delta:  0, className: 'btn-warning', title: 'A little' },
      { delta: +1, className: 'btn-success', title: 'Very well' },
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
            <button
              className='btn btn-primary m-2'
              onClick={() => { this.setState({showAnswer: true}) }}>
              Show
            </button>
          </div>
          <div className='language' hidden={!this.state.showAnswer}>
            <div className='smaller'>How well did you know it?</div>
          </div>
          <div className='word' hidden={!this.state.showAnswer}>
            {evaluations.map((e) => (
              <button
                key={e.delta}
                className={`btn ${e.className} m-2`}
                title={e.title}
                onClick={() => { this.doEvaluation(e.delta); }}>
                {e.delta > 0 ? "+" : e.delta < 0 ? "-" : "0"}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Flashcard;
