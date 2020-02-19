export const
    PI2   = Math.PI * 2,
    PI180 = Math.PI / 180;


export function deg2rad(deg) {
    return deg * PI180;
}

export function fract(a) {
    return a - Math.floor(a);
}

export function sin8(time, frequency=1, phase=0, amplitude=1) {
    let s = Math.sin( (frequency * time + phase) * PI2 );
    let t = s / 2 + 0.5;  // normalise 0-1
    return Math.floor(t * amplitude * 255);
}

export function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;

    if (arguments.length === 1) {
        s = h.s;
        v = h.v;
        h = h.h;
    }

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
        default: break;
    }
    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ];
}

export function ucfirst(str) {
    if (str === undefined || str === null) {
        return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function ucwords(str) {
    if (str === undefined || str === null) {
        return str;
    }
    return str.toString().toLowerCase().split('_').map(ucfirst).join(' ');
}

// expands a template string, e.g. "Hello {name}"
export function explode(regex, str, data) {
    return str.replace(
        regex,
        function (all, name) {
            return data[name];
        }
    );
}

export function xprintf(str, data) {
    return explode(/\{([^}]*)\}/gi, str, data);
}
