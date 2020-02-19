import Shader from '../Pattern/Shader';
import Modulator from '../Model/Modulator'
import { fract, HSVtoRGB } from '../Utils'

class CircleA extends Shader {
    constructor(props) {
        super(props);
        this.falloff = props.falloff || 0.5;
        this.modA = new Modulator({
            metric: 'circle',
            width: this.width,
            height: this.height,
            ox: this.midx,
            oy: this.midy,
            xfreq: 0.5,
            yfreq: 0.9,
            direction: -0.7,
            oxamp: 10,
            oyamp: 10,
            oxfreq: 1.2,
            oyfreq: 0.7,
            rotation: 0.3,
            //falloff: this.falloff,
            speed: 0.5,
        });
    }
    animateCell(time, x, y) {
        let a = this.modA.modulate(time, x, y);
        let b = a * a * a;
        return HSVtoRGB(
            fract(0.5 + Math.sin(time) * 0.5 + a * 0.3),
            1 - fract(b * 2)* 0.8 * (Math.cos(time/2) / 1 + 0.5),
            1 - fract((b + 0.25) * 2) * 0.8 * (Math.sin(time/3) / 2 + 0.5)
        );
    }
}

export default CircleA
