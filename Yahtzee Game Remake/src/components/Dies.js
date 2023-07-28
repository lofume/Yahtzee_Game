import React from 'react';
import '../styles/Die.css';
import { rolld6 } from '../DiceScore';

class Dies extends React.Component {j
  constructor(props) {
    super(props);
    
    this.handleClick = this.handleClick.bind(this)
  }
  
  handleClick() {
    this.props.toggleDieLock(this.props.index);
  }
  
  render() {
    const icons = [
      null,
      'fas fa-dice-one',
      'fas fa-dice-two',
      'fas fa-dice-three',
      'fas fa-dice-four',
      'fas fa-dice-five',
      'fas fa-dice-six'
    ];
    
    const locked = this.props.locked ? 'locked' : '';
    const value = this.props.value ? icons[this.props.value] : icons[rolld6()]
    const yatzyMode = this.props.yatzyMode ? 'yahtzee-mode': '';
    return (
        <i className={`die ${locked} ${value} ${yatzyMode}`}
          onClick={this.handleClick}></i>
    )
  }
}

export default Dies;