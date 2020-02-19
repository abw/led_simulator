import React from 'react'

class MatrixDisplay extends React.Component {
    render() {
        let {grid} = this.props;
        return <div className="matrix">
          {grid.map(
            (row, y) => <div className="row" key={y}>
              {row.map(
                (cell, x) => {
                  return <div className="cell" key={x}
                    style={{ backgroundColor: `rgb(${cell[0]}, ${cell[1]}, ${cell[2]})` }}>
                  </div>
                }
              )}
            </div>
          )}
        </div>
    }
}

export default MatrixDisplay
