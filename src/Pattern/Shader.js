import { sin8 } from '../Utils'

class Shader {
    constructor(props) {
        this.matrix = props.matrix;
        this.speed  = props.speed || 1;
        this.width  = props.width  || this.matrix.width;
        this.height = props.height || this.matrix.height;
        this.maxx   = this.width - 1;
        this.maxy   = this.height - 1;
        this.midx   = Math.floor(this.maxx/2);
        this.midy   = Math.floor(this.maxy/2);
    }
    animate(time) {
        this.matrix.grid.forEach(
            (row, y) => row.forEach(
                (cell, x) => row[x] = this.animateCell(time, x, y)
            )
      );
    }
    animateCell(time, x, y) {
        // subclasses should redefine this method
        let v = sin8(time * this.speed);
        return [v, v, v]
    }
}

export default Shader
