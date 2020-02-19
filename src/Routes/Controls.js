import React from 'react';
import Test from '../Control/Test';

class Controls extends React.Component {
    constructor(props) {
        super(props);
        this.setValue = this.setValue.bind(this);
        this.state = {
          value: 23,
        };
    }
    setValue(v) {
      //console.log("setValue: ", v);
      this.setState({ value: v });
    }
    render() {
        return <div className="controls horz height-3">
          <Test caption="Frumpage" onChange={this.setValue} value={this.state.value} units="%"/>
          <Test caption="Wibblage" onChange={this.setValue} value={this.state.value} units="%"/>
          <Test caption="Wobblage" onChange={this.setValue} value={this.state.value} units="%"/>
          <Test caption="Warblage" onChange={this.setValue} value={this.state.value} units="%"/>
        </div>
    }
}

export default Controls
