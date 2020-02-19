import { ucwords, xprintf } from '../Utils';

const defaults = {
    minValue:   0,
    maxValue:   100,
    //centreValue: 50,
    minAngle:   30,
    maxAngle:   330,
    delta:       1,
    threshold: 10, // pixels to move
    //sensitivity: 1,     // defaults to 1 in init_values() below
    fullRange:  200,   // used to compute sensitivity for values
    xFactor:    10,     // for every 1 pixels moved in x direction...
    xJump:      20,    // ...jump by the equivalent of 20 pixels
    value:       0,
    units:       '%',
    valueFormat: '{value}{units}',
    valuesFormat: '{value}',
    caption:     false,
    reset:       true
};

class Logic {
    constructor(config) {
        this.state = this.configureControl({
            ...defaults,
            ...config
        });
        //this.state.text = this.valueText(this.state.value);
    }
    configureControl(state) {
        if (state.values) {
            // console.log("special case values: ", state.values)
            state.minValue    = 0;
            state.maxValue    = state.values.length - 1;
            state.delta       = 1;
            state.units       = '';
            state.valueFormat = state.valuesFormat;
            // TODO: sensitivity is the wrong word here... it's a measure
            // of how many pixels have to be moved in a drag to register
            // a single step change.  Larger values make the control
            // LESS sensitive to change.
            //state.sensitivity = Math.floor(400 / state.values.length);
            if (state.centreValue) {
                state.minValue -= state.centreValue;
                state.maxValue -= state.centreValue;
            }
        }
        state.threshold    = state.threshold || 1;
        //state.sensitivity  = state.sensitivity || 1;
        state.range        = state.maxValue - state.minValue;
        state.angleRange   = state.maxAngle - state.minAngle;
        state.initialValue = state.value;
        return state;
    }

    scaleAngle(value) {
        return this.scaleValue(this.state.angleRange, value);
    }

    scaleValue(scale, value) {
        if (value === undefined) {
            //console.log("value is undefined, defaulting to state.value: ", this.state.value);
            value = this.state.initialValue;
        }
        return scale
            * (value - this.state.minValue)
            / this.state.range;
        //console.log(
        //    "scale:%s value:%s  minValue:%s  value-minValue:%s  range:%s => %s",
        //    scale, value, this.state.minValue, value - this.state.minValue,
        //    this.state.range, res
        //);
    }

    displayValue(value=this.state.value) {
        let state = this.state;

        // we may have shifted the values to negative / positive
        // so that the centre value is presented in the middle
        if (state.centreValue) {
            value += state.centreValue;
        }

        if (state.values) {
            value = state.values[value];

            if (state.labels) {
                value = state.labels[value] || ucwords(value);
            }
            else {
                value = ucwords(value);
            }
        }

        return value;
    }
    valueText(value=this.state.value) {
        return xprintf(
            this.state.valueFormat,
            { value: this.displayValue(value), units: this.state.units }
        );
    }

    relativeChange(delta, oldv) {
        let change = Math.floor(delta / this.state.threshold),
            newv   = oldv + (change * this.state.delta);
        //console.log(
        //    "relative change: ", delta,
        //    "  / threshold(", this.state.threshold, ") = ", change,
        //    "  old value:", oldv, " new value: ", newv
        //);
        this.setValue(newv);
    }

    triggerValue() {
        // hack to trigger control into thinking the value has
        // changed so that it notifies onChange() handler.
        // use to initialise display at start before anything has changed
        if (this.state.onChange) {
            this.state.onChange(
                this.state.value, this.mapValue(this.state.value)
            );
        }
    }
    resetValue() {
        this.setValue(this.state.initialValue);
    }
    setValue(v, quietly) {
        let state = this.state;
        if (v > state.maxValue) {
            v = state.maxValue;
            //console.log("clamped value to max: ", v);
        }
        if (v < state.minValue) {
            v = state.minValue;
            //console.log("clamped value to min: ", v);
        }
        if (v === state.value) {
            //console.log("no change to value: ", v, " vs ", state.value);
        }
        else {
            state.value = v;
            //console.log("changing value from ", state.value, " to ", v);
            if (state.onChange && ! quietly) {
                state.onChange(
                    v, this.mapValue(v)
                );
            }
        }
    }
    getValue() {
        return this.mapValue(this.state.value);
    }
    mapValue(v) {
        let state = this.state;

        if (state.values) {
            //console.log("mapping value:%s to list of values", v);
            if (state.centreValue) {
                v += state.centreValue;
            }
            v = state.values[v];
        }
        else if (state.scale) {
            //console.log("scaling value:%s by scale:", v, state.scale);
            v = v * state.scale;
        }
        //console.log("mapped value: %s", v);
        return v;
    }
    dragOn(e) {
        //console.log("DRAG ON");
        this.state.dragging = {
            startX:     e.pageX,
            startY:     e.pageY,
            startValue: this.state.value,
            move:       this.dragMove.bind(this),
            stop:       this.dragOff.bind(this)
        };
        document.addEventListener('mousemove', this.state.dragging.move);
        document.addEventListener('mouseup',   this.state.dragging.stop);
        e.stopPropagation();
        e.preventDefault();
        if (this.state.onDragOn) {
            this.state.onDragOn(this.state.dragging);
        }
    }
    dragMove(e) {
        if (this.state.dragging) {
            let drag = this.state.dragging,
                dx  = e.pageX - drag.startX,
                dy  = e.pageY - drag.startY,
                dxy = -dy // we invert it to make upwards positive
                    + Math.floor(dx / this.state.xFactor) * this.state.xJump;

            //console.log(
            //    "drag: dx:", dx, ", dy:", dy,
            //    " dxf:", (dx % this.state.xFactor),
            //    " dxy:", dxy
            //);

            //console.log("DRAG MOVE");
            this.relativeChange(dxy, drag.startValue);
        }
    }
    dragOff(e) {
        //console.log("DRAG OFF");
        this.state.dragging = false;
        document.removeEventListener('mousemove', this.state.dragging.move);
        document.removeEventListener('mouseup', this.state.dragging.stop);
        e.stopPropagation();
        e.preventDefault();
        if (this.state.onDragOff) {
            this.state.onDragOff(this.state.dragging);
        }
    }
    dragging() {
        return this.state.dragging;
    }
}

export default Logic;

//onMouseDown: function (e) {
//onMouseUp: function (e) {
//  x: e.pageX - this.state.rel.x,
//  y: e.pageY - this.state.rel.y
