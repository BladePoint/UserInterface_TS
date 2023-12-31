import { UIElement, UIButton } from './UIElement';
import { getGradient, AcuteTriangle, Circle, Rectangle, SemicircleBar,
         CircleOptions,
         LEFT_TO_RIGHT, RIGHT_TO_LEFT, TOP_TO_BOTTOM, BOTTOM_TO_TOP
       } from '../UserInterface_TS/Primitives';
import { clamp } from '../Utilities_TS/mathUtils';
export const ICON_UP_TOP_HEX = '#000000';
export const ICON_UP_BOTTOM_HEX = '#333333';
export const ICON_DOWN_TOP_HEX = '#202020';
export const ICON_DOWN_BOTTOM_HEX = '#363363';
export const SHADOW_UP_HEX = '#ffffff';
export const SHADOW_DOWN_HEX = '#bbbbbb';
export const iconUpGradient = getGradient('iconUp', [ICON_UP_TOP_HEX, ICON_UP_BOTTOM_HEX], TOP_TO_BOTTOM);
export const iconDownGradient = getGradient('iconDown', [ICON_DOWN_TOP_HEX, ICON_DOWN_BOTTOM_HEX], TOP_TO_BOTTOM);
const GLASS_LIGHT_HEX = '#eaebdc';

class iButton extends UIButton {
    pointerElement: UIElement;
    upFunction: (() => void) | null;
    constructor(pointerElement: UIElement, upFunction: (() => void) | null = null) {
        super();
        this.pointerElement = pointerElement;
        this.addMouseListeners(pointerElement);
        this.upFunction = upFunction;
    }
    enable() {
        this.pointerElement.enable();
    }
    disable() {
        this.pointerElement.disable();
    }
    onDown = (evt: Event) => {
        super.onDown(evt);
        this.downState();
    }
    onLeave = (evt: Event) => {
        super.onLeave(evt);
        this.upState();
    }
    onUp = (evt: Event) => {
        if (this.isMouseDown) {
            if (this.upFunction) this.upFunction();
        }
        super.onUp(evt);
        this.upState();
    }
    upState() {}
    downState() {}
}

export class ShadedRect extends UIElement {
    constructor(options: {
        width: number,
        height: number,
        lightHex?: string,
        darkHex?: string,
        topGradientHex?: string,
        bottomGradientHex?: string,
    }) {
        super();
        const {
            width,
            height,
            lightHex = '#ffffff',
            darkHex = '#666666',
            topGradientHex = '#eeeeee',
            bottomGradientHex = '#999999'
        } = options;
        const dark = new Rectangle({
            width,
            height,
            borderRadius: 6,
            background: darkHex,
        });
        const light = new Rectangle({
            width: width - 2,
            height: height - 2,
            borderRadius: 5,
            background: `linear-gradient(${lightHex}, ${darkHex})`,
            top: 1,
            left: 1,
        });
        const gradient = new Rectangle({
            width: width - 2,
            height: height - 3,
            borderRadius: 5,
            background: `linear-gradient(${topGradientHex}, ${bottomGradientHex})`,
            top: 2,
            left: 1,
        });
        this.appendChild(dark);
        this.appendChild(light);
        this.appendChild(gradient);
    }
}

export class RectButton extends UIElement {
    constructor(options: {
        width: number,
        height: number,
        rimHex?: string,
        bottomGradientHex: string,
        left: number,
        top: number,
    }) {
        super();
        const {
            width,
            height,
            rimHex = '#ffffff',
            bottomGradientHex,
            left = 0,
            top = 0,
        } = options;
        const rim = new Rectangle({
            width,
            height,
            borderRadius: 6,
            background: rimHex,
            top: 1,
        });
        const shadedRect = new ShadedRect({
            width,
            height,
            bottomGradientHex,
        });
        this.appendChild(rim);
        this.appendChild(shadedRect);
        UIElement.assignStyles(this, {
            left: `${left}px`,
            top: `${top}px`,
        });
    }
}

export class ShadedCircle extends iButton {
    private upGradient: string;
    private downGradient: string;
    private upOptions: CircleOptions;
    private downOptions: CircleOptions;
    private light: Circle;
    private gradient: Circle;
    constructor(options: {
        upFunction: (() => void) | null;
        diameter: number;
        darkHex?: string;
        lightHex?: string;
        bottomGradientHex: string;
    }) {
        const {
            upFunction,
            diameter,
            darkHex = '#333333',
            lightHex = '#ffffff',
            bottomGradientHex,
        } = options;
        const dark = new Circle({
            width: diameter,
            height: diameter,
            background: darkHex,
        });
        super(dark, upFunction);
        this.upGradient = `linear-gradient(${lightHex}, ${bottomGradientHex}`;
        this.downGradient = `linear-gradient(${bottomGradientHex}, ${lightHex})`;
        this.upOptions = {
            width: diameter - 2,
            height: diameter - 3,
            background: this.upGradient,
            left: 1,
            top: 2
        };
        this.downOptions = {
            width: diameter - 2,
            height: diameter - 2,
            background: this.downGradient,
            top: 1,
            left: 1,
        };
        const lightDiameter: number = diameter - 2;
        this.light = new Circle({
            width: lightDiameter,
            height: lightDiameter,
            background: lightHex,
            top: 1,
            left: 1,
        });
        this.gradient = new Circle(this.upOptions);
        this.appendChild(dark);
        this.appendChild(this.light);
        this.appendChild(this.gradient);
    }

    /*upState() {
      this.light.style.display = 'inline-block';
      this.gradient.parseOptions(this.upOptions);
    }

    downState() {
      this.light.style display = 'none';
      this.gradient.parseOptions(this.downOptions);
    }*/
}
  
