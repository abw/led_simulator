
class Matrix {
    constructor(props={}) {
        this.width  = props.width  || 32;
        this.height = props.height || 32;
        this.grid   = Array(this.height).fill(0).map(
            row => Array(this.width).fill([0,0,0])
        );
    }
}

export default Matrix
