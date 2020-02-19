import React from 'react';
import Path from '../../SVG/Path';

class Knob extends React.Component {
    static defaultProps = {
        minValue:   0,
        maxValue:   100,
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
    }
    constructor(props) {
        super(props);
        if (props.width && props.height) {
            this.initSize(props.width, props.height);
        }
        this.state = {
        };
    }
    initSize(width=1, height=1) {
        let {logic, minAngle} = this.props;
        let minSize = width < height ? width : height;
        console.log("initSize: %sx%s min:%s", width, height, minSize);
        this.size = {
            minSize:      minSize,
            left:         Math.floor((width  - minSize) / 2),
            top:          Math.floor((height - minSize) / 2),
            midx:         Math.floor(minSize / 2),
            midy:         Math.floor(minSize / 2),
            dialRadius:   Math.floor(minSize / 2) - 1,
            resetRadius:  Math.floor(minSize / 6) - 1,
            sweepRadius:  Math.floor(minSize / 3) - 1,
            sweepWidth:   Math.floor(minSize / 4) - 1,
            zeroAngle:    logic.scaleAngle(0) + minAngle,
        };
        //console.log("initSize: ", this.size);
        return this.setState(this.size);
    }
    componentDidUpdate(prevProps) {
        let props = this.props;
        if (props.width && props.height
          && prevProps.width !== props.width
          && prevProps.height !== props.height
        ) {
            this.initSize(props.width, props.height);
        }
    }
    resetControl() { }
    render() {
        let {width, height, logic, value, minAngle, maxAngle} = this.props;
        if (! this.size) {
            return null;
        }
        let {zeroAngle, lastAngle, left, top, midx, midy, minSize, dialRadius, sweepRadius, sweepWidth, resetRadius} = this.state;
        let valueAngle  = logic.scaleAngle(value) + minAngle,
            startAngle  = zeroAngle < valueAngle ? zeroAngle : valueAngle,
            endAngle    = zeroAngle < valueAngle ? valueAngle : zeroAngle,
            sweepPath   = (new Path()).sweep(midx, midy, sweepRadius, startAngle, endAngle),
            rangePath   = (new Path()).sweep(midx, midy, sweepRadius, minAngle, maxAngle),
            classes     = ['knob'];
        if (this.props.dragging) {
            classes.push('drag');
        }

        //console.log("SVG %s x %s", width, height);
        return <svg width={minSize} height={minSize} className={classes.join(' ')}    style={{position:'absolute',left,top}}>
            <circle cx={midx} cy={midy} r={dialRadius} className="dial"
              onMouseDown={ (e) => logic.dragOn(e) }
            />
            <path className="range" d={rangePath.text()} strokeWidth={sweepWidth} />
            <path className="sweep" d={sweepPath.text()} strokeWidth={sweepWidth} />
            {this.props.reset &&
              <circle cx={midx} cy={midy} r={resetRadius} className="reset"
                onClick={ (e) => this.resetControl() }/>
            }
        </svg>
    }
}

export default Knob
