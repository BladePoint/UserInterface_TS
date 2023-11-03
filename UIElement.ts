export class UIElement extends EventTarget {
    static SVGNS = "http://www.w3.org/2000/svg";
    static DIV = 'div';
    static SVG = 'svg';
    static POLYGON = 'polygon';
    static LINEAR_GRADIENT = 'linearGradient';
    static STOP = 'stop';
    static assignStyles(element: HTMLElement | UIElement, styleObject: Record<string, string>) {
        Object.assign(element.style, styleObject);
    }
    static assignAttributes(element: Element, attributeObject: Record<string, string>) {
        for (const property in attributeObject) {
            element.setAttribute(property, attributeObject[property]);
        }
    }
    static assignDefaultStyles(element: HTMLElement, type: string) {
        const styleObject: Record<string, string> = {
            pointerEvents: 'none',
            position: 'absolute'
        };
        if (type == UIElement.DIV) {
            styleObject.display = 'inline-block';
            styleObject.margin = '0';
            styleObject.padding = '0';
        }
        UIElement.assignStyles(element, styleObject);
    }
    static parseElementType(elementType: string): Element {
        if (elementType === UIElement.DIV) return document.createElement(UIElement.DIV); //HTMLElement
        else if (elementType === UIElement.SVG) return document.createElementNS(UIElement.SVGNS, UIElement.SVG); //SVGElement
        else if (elementType === UIElement.POLYGON) return document.createElementNS(UIElement.SVGNS, UIElement.POLYGON); //SVGElement
        else if (elementType === UIElement.LINEAR_GRADIENT) return document.createElementNS(UIElement.SVGNS, UIElement.LINEAR_GRADIENT); //SVGElement
        else if (elementType === UIElement.STOP) return document.createElementNS(UIElement.SVGNS, UIElement.STOP); //SVGElement
        else throw new Error(`Invalid elementType "${elementType}".`);
    }
    static parsePxArgument(argument: number | string): string {
        return typeof argument === 'number' ? `${argument}px` : argument;
    }
    static parseObject(styleObject: Record<string, any>): Record<string, any> {
        const returnObject: Record<string, any> = {};
        for (const key in styleObject) {
            if (key === 'width' || key === 'height' || key === 'borderRadius' || key === 'left' || key === 'right' || key === 'top' || key === 'bottom' || key === 'fontSize') {
                returnObject[key] = UIElement.parsePxArgument(styleObject[key]);
            } else returnObject[key] = styleObject[key];
        }
        return returnObject;
    }
    static setPointer(element: HTMLElement, value: boolean | string) {
        const argumentType = typeof value;
        let pointerString: string;
        if (argumentType === 'boolean') pointerString = value ? 'auto' : 'none';
        else if (argumentType === 'string') pointerString = value as string;
        else throw new Error('Invalid data type for "value" parameter.');
        element.style.pointerEvents = pointerString;
    }

    protected element: HTMLElement;
    constructor(elementType: string = UIElement.DIV) {
        super();
        this.element = UIElement.parseElementType(elementType) as HTMLElement;
        UIElement.assignDefaultStyles(this.element, elementType);
    }
    get style(): CSSStyleDeclaration {
        return this.element.style;
    }
    assignStyles(styleObject: Record<string, any>) {
        const parsedStyleObject = UIElement.parseObject(styleObject);
        UIElement.assignStyles(this, parsedStyleObject);
    }
    assignAttributes(attributeObject: Record<string, any>) {
        const parsedAttributeObject = UIElement.parseObject(attributeObject);
        UIElement.assignAttributes(this.element, parsedAttributeObject);
    }
    appendChild(child: UIElement | Element) {
        if (child instanceof UIElement) child.appendToParent(this.element);
        else this.element.appendChild(child);
    }
    appendToParent(parent: Element) {
        parent.appendChild(this.element);
    }
    prependChild(child: UIElement | Element) {
        if (child instanceof UIElement) child.prependToParent(this.element);
        else this.element.insertBefore(child, this.element.firstChild);
    }
    prependToParent(parent: Element) {
        parent.insertBefore(this.element, parent.firstChild);
    }
    removeChild(child: UIElement | Element) {
        if (child instanceof UIElement) child.removeFromParent(this.element);
        else this.element.removeChild(child);
    }
    removeFromParent(parent: Element) {
        parent.removeChild(this.element);
    }
    dispatchEventWith(eventName: string, eventData: Record<string, any> = {}) {
        const event = new CustomEvent(eventName, { detail: eventData });
        this.dispatchEvent(event);
    }
    addInteractiveListener(eventName: string, callback: EventListenerOrEventListenerObject) {
        this.element.addEventListener(eventName, callback);
    }
    removeInteractiveListener(eventName: string, callback: EventListenerOrEventListenerObject) {
        this.element.removeEventListener(eventName, callback);
    }
    enable() {
        UIElement.setPointer(this.element as HTMLElement, true);
    }
    disable() {
        UIElement.setPointer(this.element as HTMLElement, false);
    }
}

export class UIButton extends UIElement {
    static MOUSE_ENTER = 'mouseenter';
    static MOUSE_DOWN = 'mousedown';
    static MOUSE_LEAVE = 'mouseleave';
    static MOUSE_UP = 'mouseup';
    static addEnterListener(eventTarget: EventTarget, callback: EventListenerOrEventListenerObject) {
        if (eventTarget instanceof UIElement) eventTarget.addInteractiveListener(UIButton.MOUSE_ENTER, callback);
        else eventTarget.addEventListener(UIButton.MOUSE_ENTER, callback);
    }
    static addDownListener(eventTarget: EventTarget, callback: EventListenerOrEventListenerObject) {
        if (eventTarget instanceof UIElement) eventTarget.addInteractiveListener(UIButton.MOUSE_DOWN, callback);
        else eventTarget.addEventListener(UIButton.MOUSE_DOWN, callback);
    }
    static addLeaveListener(eventTarget: EventTarget, callback: EventListenerOrEventListenerObject) {
        if (eventTarget instanceof UIElement) eventTarget.addInteractiveListener(UIButton.MOUSE_LEAVE, callback);
        else eventTarget.addEventListener(UIButton.MOUSE_LEAVE, callback);
    }
    static addUpListener(eventTarget: EventTarget, callback: EventListenerOrEventListenerObject) {
        if (eventTarget instanceof UIElement) eventTarget.addInteractiveListener(UIButton.MOUSE_UP, callback);
        else eventTarget.addEventListener(UIButton.MOUSE_UP, callback);
    }

    isMouseDown: boolean = false;
    isMouseHover: boolean = false;
    constructor(elementType: string = UIElement.DIV) {
        super(elementType);
        this.style.cursor = 'pointer';
    }
    addMouseListeners(elementTarget: UIElement | Element) {
        UIButton.addEnterListener(elementTarget, this.onEnter);
        UIButton.addDownListener(elementTarget, this.onDown);
        UIButton.addLeaveListener(elementTarget, this.onLeave);
        UIButton.addUpListener(elementTarget, this.onUp);
    }
    onEnter(evt: Event) {
        this.isMouseHover = true;
    }
    onDown(evt: Event) {
        this.isMouseDown = true;
    }
    onLeave(evt: Event) {
        this.isMouseHover = false;
        this.isMouseDown = false;
    }
    onUp(evt: Event) {
        this.isMouseDown = false;
    }
}
