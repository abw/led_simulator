import React from 'react';
import Dimensions from 'react-dimensions';

class Home extends React.Component {
    render() {
        return <div className="matrix">
          <div className="row">
            <div className="cell">A</div>
            <div className="cell">B</div>
            <div className="cell">C</div>
          </div>
          <div className="row">
            <div className="cell">D</div>
            <div className="cell">E</div>
            <div className="cell">F</div>
          </div>
          <div className="row">
            <div className="cell">G</div>
            <div className="cell">H</div>
            <div className="cell">I</div>
          </div>
          {console.log("props:", this.props)}
        </div>
    }
}

export default Home
//export default Dimensions()(Home)
