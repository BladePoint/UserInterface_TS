import { UIElement } from './UIElement';
import { degreesToRadians } from '../Utilities_TS/mathUtils';
export const LEFT_TO_RIGHT = 'leftToRight';
export const RIGHT_TO_LEFT = 'rightToLeft';
export const TOP_TO_BOTTOM = 'topToBottom';
export const BOTTOM_TO_TOP = 'bottomToTop';
export function getGradient(id: string, colors: string[], direction: string | { x1: number; y1: number; degrees: number; distance: number }) {
    const parseDirection = (gradient: SVGElement, direction: string | { x1: number; y1: number; degrees: number; distance: number }) => {
        let x1: number;
        let y1: number;
        let x2: number;
        let y2: number;
        let type = typeof direction;
        if (type === 'string') {
            switch (direction) {
                case LEFT_TO_RIGHT:
                    x1 = 0;
                    y1 = 0;
                    x2 = 100;
                    y2 = 0;
                    break;
                case RIGHT_TO_LEFT:
                    x1 = 100;
                    y1 = 0;
                    x2 = 0;
                    y2 = 0;
                    break;
                case TOP_TO_BOTTOM:
                    x1 = 0;
                    y1 = 0;
                    x2 = 0;
                    y2 = 100;
                    break;
                case BOTTOM_TO_TOP:
                    x1 = 0;
                    y1 = 100;
                    x2 = 0;
                    y2 = 0;
                    break;
                default:
                    throw new Error(`Invalid gradientDirection "${direction}".`);
            }
        } else if (type === 'object') {
            const dir = direction as { x1: number; y1: number; degrees: number; distance: number };
            x1 = dir.x1;
            y1 = dir.y1;
            const radians = degreesToRadians(dir.degrees);
            x2 = x1 + Math.cos(radians) * dir.distance;
            y2 = y1 + Math.sin(radians) * dir.distance;
        } else throw new Error('Invalid data type for gradientDirection. It must be ')
        UIElement.assignAttributes(gradient, {
            x1: `${x1}%`,
            y1: `${y1}%`,
            x2: `${x2}%`,
            y2: `${y2}%`
        });
    }
    const gradient = UIElement.parseElementType(UIElement.LINEAR_GRADIENT) as SVGElement;
    gradient.id = id;
    const l = colors.length;
    for (let i = 0; i < l; i++) {
        const stop = UIElement.parseElementType(UIElement.STOP);
        UIElement.assignAttributes(stop, {
            offset: `${(i / (l - 1)) * 100}%`,
            'stop-color': colors[i]
        });
        gradient.appendChild(stop);
    }
    parseDirection(gradient, direction);
    return gradient;
}

export class Rectangle extends UIElement {
    constructor(options: {
        width: number;
        height: number;
        background: string;
        borderRadius?: number;
        left?: number;
        top?: number;
    }) {
        super();
        const { width, height, background, borderRadius = 0, left = 0, top = 0 } = options;
        this.assignStyles({
            width,
            height,
            borderRadius,
            background,
            left,
            top
        });
    }
}

export class Circle extends UIElement {
    constructor(options: {
        diameter: number;
        background: string;
        left?: number;
        top?: number;
    }) {
        super();
        const { diameter, background, left = 0, top = 0 } = options;
        this.assignStyles({
            width: diameter,
            height: diameter,
            borderRadius: '50%',
            background,
            left,
            top
        });
    }
}

export class SemicircleBar extends UIElement {
    constructor(options: {
        width: number;
        height: number;
        background: string;
        left?: number;
        top?: number;
    }) {
        super();
        const { width, height, background, left = 0, top = 0 } = options;
        this.assignStyles({
            width,
            height,
            background,
            borderRadius: height / 2,
            left,
            top
        });
    }
}

export class AcuteTriangle extends UIElement {
    static UP = "up";
    static DOWN = "down";
    static RIGHT = "right";
    static LEFT = "left";

    width: number;
    height: number;
    polygon: Element;
    constructor(options: {
        orientation?: string;
        width: number;
        height: number;
    }) {
        super(UIElement.SVG);
        const { orientation = AcuteTriangle.UP, width, height } = options;
        this.width = width;
        this.height = height;
        this.polygon = this.drawPolygon(orientation, width, height);
        this.appendChild(this.polygon);
        this.assignAttributes({
            width,
            height,
        });
    }
    drawPolygon(orientation: string, width: number, height: number): Element {
        const polygon = UIElement.parseElementType(UIElement.POLYGON);
        let points: string;
        switch (orientation) {
            case AcuteTriangle.UP:
                points = `0,${height} ${width / 2},0 ${width},${height}`;
                break;
            case AcuteTriangle.DOWN:
                points = `0,0 ${width / 2},${height} ${width},0`;
                break;
            case AcuteTriangle.LEFT:
                points = `${width},0 0,${height / 2} ${width},${height}`;
                break;
            case AcuteTriangle.RIGHT:
                points = `0,0 ${width},${height / 2} 0,${height}`;
                break;
            default:
                throw new Error(`Invalid AcuteTriangle orientation "${orientation}".`);
        }
        polygon.setAttribute('points', points);
        return polygon;
    }
    colorPolygon(color: string | SVGElement) {
        const existingGradients: NodeListOf<SVGLinearGradientElement> = this.element.querySelectorAll('linearGradient');
        existingGradients.forEach((existingGradient) => {
            this.removeChild(existingGradient);
        });
        let fillValue: string;
        if (color instanceof SVGElement) {
            this.appendChild(color);
            fillValue = `url(#${color.id})`;
        } else if (typeof color === 'string') fillValue = color;
        else throw new Error('Invalid color.');
        this.polygon.setAttribute('fill', fillValue);
    }
    /*parseStateOptions(options: { color: string; left: number; top: number }) {
        this.colorPolygon(options.color);
        this.element.setAttribute('transform', `translate(${options.left}, ${options.top})`);
    }*/
}