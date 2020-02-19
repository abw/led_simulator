import { fract, PI2 } from '../Utils';

const defaults = {
    width: 24,
    height: 18,
    ox: 12,
    oy: 9,
    oxamp: 0,
    oxfreq: 1,
    oyamp: 0,
    oyfreq: 1,
    xfreq: 1,
    yfreq: 1,
    phase: 0,
    rotation: 0,
    speed: 1,
    direction: 1,
    metric: 'circle',
    waveform: 'sin',
};
export const waveforms = {
    sin:      n => Math.sin(PI2 * n) * 0.5 + 0.5,
    cos:      n => Math.cos(PI2 * n) * 0.5 + 0.5,
    up:       n => fract(n),
    down:     n => 1 - fract(n),
    square:   n => fract(n) < 0.5 ? 0 : 1,
    triangle: n => {
        let f = fract(n);
        return f < 0.5 ? f * 2 : (1 - f) * 2;
    },
};
const metrics = {
    horizontal: {
        name: 'Horizontal',
        fn: (x, y) => x,
    },
    horizontals: {
        name: 'Horizontal Symmetry',
        fn: (x, y) => Math.abs(x),
    },
    vertical: {
        name: 'Vertical',
        fn: (x, y) => y,
    },
    verticals: {
        name: 'Vertical Symmetry',
        fn: (x, y) => Math.abs(y),
    },
    diagonal: {
        name: 'Diagonal',
        fn: (x, y) => (x + y) / 2,
    },
    diagonals: {
        name: 'Diagonal Symmetry',
        fn: (x, y) => Math.abs((x + y) / 2),
    },
    diamond: {
        name: 'Diamond',
        fn: (x, y) => (Math.abs(x) + Math.abs(y)) / 2,
    },
    circle: {
        name: 'Circle',
        fn: (x, y) => Math.sqrt(x*x + y*y),
    }
};


class Modulator {
    constructor(args) {
        let props = this.props = { ...defaults, ...args };
        props.mindim = props.height < props.width
            ? props.height : props.width;
        props.rotrad = props.rotation * 2 * Math.PI;
        props.phaserad = props.phase * 2 * Math.PI;
        this.metric = metrics[props.metric];
        this.waveform = waveforms[props.waveform];
    }
    modulate8(time, x, y) {
        return Math.floor(this.modulate(time, x, y) * 255);
    }
    modulate(time, x, y) {
        let props = this.props;
        let ox   = props.ox + props.oxamp * Math.sin(time * props.oxfreq),
            oy   = props.oy + props.oyamp * Math.sin(time * props.oyfreq),
            dx   = (x - ox) / props.mindim,
            dy   = (y - oy) / props.mindim,
            sinr = Math.sin(props.rotrad * time),
            cosr = Math.cos(props.rotrad * time),
            rx   = dx * cosr - dy * sinr,
            ry   = dx * sinr + dy * cosr,
            px   = rx * props.xfreq,// * 2 * Math.PI,
            py   = ry * props.yfreq,// * 2 * Math.PI,
            dist = this.metric.fn(px, py),
            val  = this.waveform(time * props.speed + props.phase + dist * props.direction);

        if (props.falloff) {
            let den = Math.pow(0.5 + dist, props.falloff);
            if (den > 1) {
                val = val / den;
            }
        }
        return val;
    }
}

export default Modulator
