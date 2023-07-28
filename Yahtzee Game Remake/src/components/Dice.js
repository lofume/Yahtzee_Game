import React from 'react';
import Dies from './Dies';
import '../styles/Dice.css';

class Dice extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    if(this.props.remainingRolls > 0) {
      this.props.rollDice();
    }
  }
  render() {
    return (
      <div className="dices">
        <div className="dice__container">
          {this.props.dice.map((die, i) => (
            <Dies 
              yatzyMode={this.props.yatzyMode}
              value={die.value} 
              locked={die.locked}
              remainingRolls={this.props.remainingRolls}
              toggleDieLock={this.props.toggleDieLock}
              index={i}
              key={i}
          />))}
        </div>
        <button 
          className={this.props.remainingRolls % 2
          ? "dice__roll-button safariHack"
          : "dice__roll-button"
          }
          disabled={!this.props.remainingRolls > 0}
          onClick={this.handleClick}
        > You have {this.props.remainingRolls} Rolls Left
        </button>
      </div>
    )
  }
}

export default Dice;