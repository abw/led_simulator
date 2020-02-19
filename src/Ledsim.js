import React from 'react'
import Home from './Routes/Home'
import Matrix from './Model/Matrix'
import MatrixDisplay from './Display/Matrix'
import Pattern from './Patterns/MultiModA'

class Ledsim extends React.Component {
    constructor(props) {
        super(props);
        this.matrix = new Matrix();
        this.state = {
            grid: this.matrix.grid,
        };
    }
    render() {
        let {grid} = this.state;
        return <React.Fragment>
          <header>
            <h1>Led Matrix Simulator</h1>
            <h2 className="author">by Andy Wardley</h2>
          </header>
          <main>
          <MatrixDisplay grid={grid}/>
          {console.log("props:", this.props)}
          </main>
          <footer>
            <button onClick={() => this.startAnimation()}>Start</button>
            <button onClick={() => this.stopAnimation()}>Stop</button>
          </footer>
        </React.Fragment>
    }
}

export default Ledsim
