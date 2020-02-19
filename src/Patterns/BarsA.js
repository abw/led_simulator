import Shader from '../Pattern/Shader';
import Modulator from '../Model/Modulator'
import { fract, HSVtoRGB } from '../Utils'

class BarsA extends Shader {
    constructor(props) {
        super(props);
        this.falloff = props.falloff || 0.5;
        this.modA = new Modulator({
            metric: 'horizontal',
            width: this.width,
            height: this.height,
            ox: this.midx,
            oy: this.midy,
            xfreq: .2,
            direction: -0.7,
            rotation: -0.1,
            speed: 0.1,
        });
        this.modB = new Modulator({
            metric: 'horizontal',
            width: this.width,
            height: this.height,
            ox: this.midx,
            oy: this.midy,
            xfreq: 0.5,
            direction: 0.7,
            rotation: -0.2,
            speed: 0.1,
        });
    }
    animateCell(time, x, y) {
        let a = this.modA.modulate(time, x, y);
        let b = this.modB.modulate(time, x, y);
        let c = (a + b) / 2;
        let d = c * c * c;
        return HSVtoRGB(
            fract(0.5 + Math.sin(time) * 0.5 + c * 0.3),
            1 - fract(d * 4)* 0.8,
            1
        );
    }
}

export default BarsA
