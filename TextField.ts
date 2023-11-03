import { UIElement } from './UIElement';

export class TextField extends UIElement {
    constructor(options: {
        text?: string;
        width?: number | string;
        height?: number | string;
        fontFamily?: string;
        fontWeight?: string;
        fontSize?: number | string;
        color?: string;
        textAlign?: string;
        whiteSpace?: string;
        left?: number | string;
        right?: number | string;
        top?: number | string;
        bottom?: number | string;
    }) {
        super();
        const {
            text = '',
            width = 'auto',
            height = 'auto',
            fontFamily = 'Arial, sans-serif',
            fontWeight = 'normal', // 'bold' , 'bolder', 'lighter'
            fontSize = '16px',
            color = '#000000',
            textAlign = 'left', // 'center', 'right', 'justify'
            whiteSpace = 'nowrap', // 'normal'
            left = '',
            right = '',
            top = '',
            bottom = ''
        } = options;
        this.assignStyles({
            width,
            height,
            fontFamily,
            fontWeight,
            fontSize,
            color,
            textAlign,
            whiteSpace,
            left,
            right,
            top,
            bottom,
            userSelect: 'none',
            overflow: 'hidden'
            /*, lineHeight,
            letterSpacing,
            border: '2px solid red',
            boxSizing: 'border-box'*/
        });
        this.text = text;
    }
    set text(newText: string) {
        this.element.innerText = newText;
    }
}
