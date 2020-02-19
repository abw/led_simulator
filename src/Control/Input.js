import React from 'react';

class Input extends React.Component {
    render() {
        let {width,height} = this.props;
        return <div className="input">
          Input: {width}x{height}
        </div>
    }
}

export default Input;
