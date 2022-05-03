import React, { Component } from 'react';
class OldBatchUpdatePage extends Component {
  state = { number: 0 }
  handelClick = () => {
    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number);
    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number);
    setTimeout(() => {
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number);
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number);
    });
  }
  render() {
    return (
      <div>
        <p>{this.state.number}</p>
        <button onClick={this.handelClick}>+</button>
      </div>
    )
  }
}
export default OldBatchUpdatePage;