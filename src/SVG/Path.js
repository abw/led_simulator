import { deg2rad } from '../Utils';

class Path {
    constructor() {
        this.parts = [ ];
    }
    move(x, y) {
        this.parts.push("M" + x + ',' + y);
        return this;
    }
    line(x, y) {
        this.parts.push("L" + x + ',' + y);
        return this;
    }
    arc(x, y, rx, ry, large=0, sweep=0) {
        // (rx ry x-axis-rotation large-arc-flag sweep-flag x y)
        this.parts.push("A" + [rx, ry, 0, large, sweep, x, y].join(" "));
        return this;
    }
    sweep(x, y, radius, startAngle, endAngle, sweep=1) {
        let startx = x - Math.sin(deg2rad(startAngle)) * radius,
            starty = y + Math.cos(deg2rad(startAngle)) * radius,
            endx   = x - Math.sin(deg2rad(endAngle))   * radius,
            endy   = y + Math.cos(deg2rad(endAngle))   * radius,
            range  = endAngle - startAngle;

        //console.log("sweep(%s, %s, %s, %s, %s, %s)", x, y, radius, startAngle, endAngle, sweep);

        return this
            .move(startx, starty)
            .arc(endx, endy, radius, radius, range <= 180 ? 0 : 1, sweep);
    }
    close() {
        this.parts.push("Z");
    }
    text() {
        return this.parts.join(" ");
    }
}

export default Path;
