import React from 'react';
import Dice from './Dice';
import Scorecard from './Scorecard';
import { rolld6, scoringFunctions } from '../DiceScore';
import '../styles/Game.css';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      remainingRolls: 2,
      dice: Array.from(Array(5)).map(i => ({value: rolld6(), locked: false})),
      score: 0,
      upperBonus: false,
      yahtzeeBonus: 0,
      yahtzeeMode: false,
      scoreItems: [
        {name: 'Aces', score: null, description: 'The sum of dice with the number 1'},
        {name: 'Twos', score: null, description: 'The sum of dice with the number 2'},
        {name: 'Threes', score: null, description: 'The sum of dice with the number 3'},
        {name: 'Fours', score: null, description: 'The sum of dice with the number 4'},
        {name: 'Fives', score: null, description: 'The sum of dice with the number 5'},
        {name: 'Sixes', score: null, description: 'The sum of dice with the number 6	'},
        {name: 'Three Of A Kind', score: null, description: 'At least three dice the same'},
        {name: 'Four Of A Kind', score: null, description: 'Sum of all dice if 4 are the same'},
        {name: 'Small Straight', score: null, description: 'Four sequential dice (1-2-3-4, 2-3-4-5, or 3-4-5-6): 30pts'},
        {name: 'Large Straight', score: null, description: 'Five sequential dice (1-2-3-4-5 or 2-3-4-5-6): 40pts'},
        {name: 'Full House', score: null, description: 'Three of one number and two of another: 25pts'},
        {name: 'Yahtzee', score: null, description: 'All five dice the same: 50pts'},
        {name: 'Chance', score: null, description: 'Any combination: Sum of all dice'}
      ]
    }
    
    this.rollDice = this.rollDice.bind(this);
    this.resetRoll = this.resetRoll.bind(this);
    this.toggleDieLock = this.toggleDieLock.bind(this);
    this.handleScore = this.handleScore.bind(this);
    this.updateBonus = this.updateBonus.bind(this);
    this.checkUpperBonus = this.checkUpperBonus.bind(this);
    this.updateYahtzeeState = this.updateYahtzeeState.bind(this);
    this.isYahtzee = this.isYahtzee.bind(this);
  }
  
  rollDice() {
    const newDice = this.state.dice.map((die) => {
      return die.locked ? die : {...die, value: rolld6()};
    })
    this.setState(prev => (
      {
        remainingRolls: prev.remainingRolls - 1,
        dice: newDice
      }), () => this.isYahtzee());
  }
  
  resetRoll() {
    this.setState(
      {
        dice: Array.from(Array(5)).map(i => ({value: rolld6(), locked: false})),
        remainingRolls: 2
      }, () => this.isYahtzee()
    )
  }
  
  toggleDieLock(index) {
    this.setState((prev) => {
      return({
        dice: prev.dice.map((die, i) => {
          if(i === index) {
            return {...die, locked: !die.locked};
          } else {
            return die
          }
        })
      })
    })
  }
  
  isYahtzee() {
    let yahtzeeDice;
    for(let i = 0; i < this.state.dice.length - 1; i++) {
      if (this.state.dice[i].value !== this.state.dice[i + 1].value) {
        return this.setState({yahtzeeMode: false})
      }
    }
    if(this.state.yahtzeeBonus) this.setState({yahtzeeMode: true})
  }
  
  handleScore(name) {
    let scoreValue = scoringFunctions[name](this.state.dice, this.state.yahtzeeMode);
    let index;
    let yahtzeeIndex;
    for(let i = 0; i < this.state.scoreItems.length; i++) {
      if(this.state.scoreItems[i].name === name) {
        index = i;
      }
      if(this.state.scoreItems[i].name === 'Yahtzee') {
        yahtzeeIndex = i;
      }
    }
    let updatedScoreItems = [...this.state.scoreItems];
    updatedScoreItems[index].score = scoreValue;
    this.setState((prev) => (
      {
        score: prev.score + scoreValue,
        scoreItems: updatedScoreItems
      }
    ), () => {this.updateBonus(yahtzeeIndex)})
    this.resetRoll();
  }
  
  updateBonus(yahtzeeIndex) {
    if(!this.state.upperBonus) this.checkUpperBonus();
    if(!this.state.yahtzeeBonus) {
      this.updateYahtzeeState(yahtzeeIndex);
    } else if(this.state.yahtzeeMode) {
      this.setState((prev) => (
        {
          score: prev.score + 100,
          yahtzeeBonus: prev.yahtzeeBonus + 1 
      }))
    }
  }
  
  checkUpperBonus() {
    const totalUpper = this.state.scoreItems.slice(0, 6).reduce((total, item) => {
      return item.score ? item.score + total : 0 + total;
    }, 0);
    if(totalUpper >= 63) {
      this.setState((prev) => (
        {
          upperBonus: true,
          score: prev.score + 35
        }
      ))
    }
  }
  
  updateYahtzeeState(yahtzeeIndex) {
    if(this.state.scoreItems[yahtzeeIndex].score) {
      this.setState((prev) => ({yahtzeeBonus: prev.yahtzeeBonus + 1}))
    }
  }
  
  render() {
    return (
      <div className="game">
        <div className="game__header">
          <div className="game__title">
          <a href="https://en.wikipedia.org/wiki/Yahtzee" target="_blank" rel="noopener noreferrer">
              <b style={{color:"black"}}>Game Rules</b>
            </a>
            <h1 style={{fontSize:"50px", fontWeight:"200", color:"black"}}>Yatzy Game!</h1>
            <i style={{color:"black"}}>Click on each line to total up Yatzy score</i>
          </div>
          <Dice 
            dice={this.state.dice}
            remainingRolls={this.state.remainingRolls}
            rollDice={this.rollDice}
            toggleDieLock={this.toggleDieLock}
            yahtzeeMode={this.state.yahtzeeMode}
          />
        </div>
        <div className="game__score-header">
          <h2 className="game__score">{`Total Score: ${this.state.score}`}</h2>
        </div>
        <Scorecard 
          dice={this.state.dice} 
          upperBonus={this.state.upperBonus}
          yahtzeeBonus={this.state.yahtzeeBonus}
          resetRoll={this.resetRoll} 
          handleScore={this.handleScore}
          scoreItems={this.state.scoreItems}
        />

      </div>
    )
  }
}

export default Game;