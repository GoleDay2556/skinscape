import type {RgbaColor} from "colord";

export type BlendFunc = (backdrop: RgbaColor, src: RgbaColor) => RgbaColor;

export const BLEND_FUNC_KINDS = [
    "Normal", "Multiply", "Darken", "Lighten", "Difference", "Color Dodge", "Color Burn"
] as const;

export type BlendFuncKind = typeof BLEND_FUNC_KINDS[number];


export const BLEND_FUNCS: {
    [key in BlendFuncKind]: BlendFunc
} = {
    "Normal": rgbaBlendNormal,
    "Multiply": rgbaBlendMultiply,
    "Darken": rgbaBlendDarken,
    "Lighten": rgbaBlendLighten,
    "Difference": rgbaBlendDifference,
    "Color Dodge": rgbaBlendColorDodge,
    "Color Burn": rgbaBlendColorBurn,
};

export function rgbaBlendNormal(backdrop: RgbaColor, src: RgbaColor): RgbaColor {
    if (backdrop.a === 0) return Object.assign({}, src);
    else if (src.a === 0) return Object.assign({}, backdrop);
    else if (src.a === 1) return Object.assign({}, src);

    const { r: r1, g: g1, b: b1, a: a1 } = backdrop;
    const { r: r2, g: g2, b: b2, a: a2 } = src;

    const a = a2 + a1 * (1 - a2);

    const r = r1 + (r2 - r1) * a2 / a;
    const g = g1 + (g2 - g1) * a2 / a;
    const b = b1 + (b2 - b1) * a2 / a;

    return { r: r, g: g, b: b, a: a };
}

export function rgbaBlendMultiply(backdrop: RgbaColor, src: RgbaColor): RgbaColor {
    if (backdrop.a === 0) return Object.assign({}, src);
    else if (src.a === 0) return Object.assign({}, backdrop);
    else if (src.a === 1) return Object.assign({}, src);

    const { r: r1, g: g1, b: b1, a: a1 } = backdrop;
    const { r: r2, g: g2, b: b2, a: a2 } = src;

    const a = a2 + a1 * (1 - a2);

    const r = (r1 * r2) / 255;
    const g = (g1 * g2) / 255;
    const b = (b1 * b2) / 255;

    return { r: r, g: g, b: b, a: a };
}

export function rgbaBlendDarken(backdrop: RgbaColor, src: RgbaColor): RgbaColor {
    if (backdrop.a === 0) return Object.assign({}, src);
    else if (src.a === 0) return Object.assign({}, backdrop);
    else if (src.a === 1) return Object.assign({}, src);

    const { r: r1, g: g1, b: b1, a: a1 } = backdrop;
    const { r: r2, g: g2, b: b2, a: a2 } = src;

    const a = a2 + a1 * (1 - a2);

    const r = Math.min(r1, r2);
    const g = Math.min(g1, g2);
    const b = Math.min(b1, b2);

    return { r: r, g: g, b: b, a: a };
}

export function rgbaBlendLighten(backdrop: RgbaColor, src: RgbaColor): RgbaColor {
    if (backdrop.a === 0) return Object.assign({}, src);
    else if (src.a === 0) return Object.assign({}, backdrop);
    else if (src.a === 1) return Object.assign({}, src);

    const { r: r1, g: g1, b: b1, a: a1 } = backdrop;
    const { r: r2, g: g2, b: b2, a: a2 } = src;

    const a = a2 + a1 * (1 - a2);

    const r = Math.max(r1, r2);
    const g = Math.max(g1, g2);
    const b = Math.max(b1, b2);

    return { r: r, g: g, b: b, a: a };
}

export function rgbaBlendDifference(backdrop: RgbaColor, src: RgbaColor): RgbaColor {
    if (backdrop.a === 0) return Object.assign({}, src);
    else if (src.a === 0) return Object.assign({}, backdrop);
    else if (src.a === 1) return Object.assign({}, src);

    const { r: r1, g: g1, b: b1, a: a1 } = backdrop;
    const { r: r2, g: g2, b: b2, a: a2 } = src;

    const a = a2 + a1 * (1 - a2);

    const r = Math.abs(r1 - r2);
    const g = Math.abs(g1 - g2);
    const b = Math.abs(b1 - b2);

    return { r: r, g: g, b: b, a: a };
}

export function rgbaBlendColorDodge(backdrop: RgbaColor, src: RgbaColor): RgbaColor {
    if (backdrop.a === 0) return Object.assign({}, src);
    else if (src.a === 0) return Object.assign({}, backdrop);
    else if (src.a === 1) return Object.assign({}, src);

    const { r: r1, g: g1, b: b1, a: a1 } = backdrop;
    const { r: r2, g: g2, b: b2, a: a2 } = src;

    const a = a2 + a1 * (1 - a2);

    const dodgeChannel = (b: number, s: number) =>
        b === 255 ? 255 : Math.min(255, (s * 255) / (255 - b));

    const r = dodgeChannel(r1, r2);
    const g = dodgeChannel(g1, g2);
    const b = dodgeChannel(b1, b2);

    return { r: r, g: g, b: b, a: a };
}

export function rgbaBlendColorBurn(backdrop: RgbaColor, src: RgbaColor): RgbaColor {
    if (backdrop.a === 0) return Object.assign({}, src);
    else if (src.a === 0) return Object.assign({}, backdrop);
    else if (src.a === 1) return Object.assign({}, src);

    const { r: r1, g: g1, b: b1, a: a1 } = backdrop;
    const { r: r2, g: g2, b: b2, a: a2 } = src;

    const a = a2 + a1 * (1 - a2);

    const burnChannel = (b: number, s: number) =>
        b === 0 ? 0 : Math.max(0, 255 - ((255 - s) * 255) / b);

    const r = burnChannel(r1, r2);
    const g = burnChannel(g1, g2);
    const b = burnChannel(b1, b2);

    return { r: r, g: g, b: b, a: a };
}

export function blendData(
    backdrop: Uint8ClampedArray,
    src: Uint8ClampedArray,
    func: BlendFunc,
): Uint8ClampedArray {
    if (backdrop.length !== src.length) throw Error("Unmatched data source lengths");
    const result = new Uint8ClampedArray(backdrop.length);

    for (let i = 0; i < backdrop.length; i += 4) {
        const a = { r: backdrop[i], g: backdrop[i + 1], b: backdrop[i + 2], a: backdrop[i + 3] };
        const b = { r: src[i], g: src[i + 1], b: src[i + 2], a: src[i + 3] };
        const blended = func(a, b);
        result.set([blended.r, blended.g, blended.b, blended.a], i);
    }

    return result;
}