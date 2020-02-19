import Modulator from '../Model/Modulator'
import { fract, HSVtoRGB } from '../Utils'

class MultiModulatorA {
    constructor(props) {
        this.width   = props.width;
        this.height  = props.height;
        this.maxx    = this.width - 1;
        this.maxy    = this.height - 1;
        this.midx    = Math.floor(this.maxx/2);
        this.midy    = Math.floor(this.maxy/2);
        this.falloff = props.falloff || 0.5;
        this.modA = new Modulator({
            width: this.width,
            height: this.height,
            ox: -8,
            oy: -5,
            oxamp: 10,
            oyamp: 5,
            oxfreq: 0.2,
            oyfreq: 0.2,
            xfreq: 1.8,
            yfreq: 2.8,
            rotation: 0.3,
            metric: 'circle',
            direction: -0.7,
            falloff: this.falloff,
            speed: 1.1,
        });
        this.modB = new Modulator({
            width: this.width,
            height: this.height,
            ox: this.maxx + 5,
            oy: 0,
            oxamp: 10,
            oyamp: 5,
            oxfreq: 0.5,
            oyfreq: 0.7,
            xfreq: 1.8,
            rotation: -0.2,
            metric: 'circle',
            direction: 0.5,
            falloff: this.falloff,
            phase: 0.25,
            speed: 0.7,
        });
        this.modC = new Modulator({
            width: this.width,
            height: this.height,
            ox: this.midx,
            oy: this.maxy + 5,
            oxamp: 20,
            oxfreq: 0.6,
            yfreq: 0.15,
            xfreq: 0.3,
            rotation: 0.1,
            metric: 'circle',
            direction: -2,
            falloff: this.falloff,
            phase: 0.50,
            speed: 0.5,
        });
        this.modD = new Modulator({
            width: this.width,
            height: this.height,
            ox: this.maxx,
            oy: this.maxy,
            metric: 'circle',
            direction: 1,
            falloff: this.falloff,
            phase: 0.75,
            speed: 1,
        });
    }
    cell(time, x, y) {
        let a = this.modA.modulate(time, x, y);
        let b = this.modB.modulate(time, x, y);
        let c = this.modC.modulate(time, x, y);
        let d = this.modD.modulate(time, x, y);
        a = a * a;
        b = b * b;
        c = c * c;
        let w = (a + b + c) / 1;
        w = w > 1 ? 1 : w;
        let v = (d + c) / 1.5;
        v = Math.pow(v, 2);
        return HSVtoRGB(
            fract(0.5 + Math.sin(time/4) * 0.5 + w/3),
            1 - fract(w * 2) / 1.2,
            1, // - fract(v) / 3    // oil slick
        );
    }
}

export default MultiModulatorA
