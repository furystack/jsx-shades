import { Component, isComponentClass } from "./Component";
import { DomObserverService } from "./DomObserverService";
import "./jsx";

/**
 * Type definition for stateless components with defined props
 */
export type StatelessComponentWithProps<TProps> = (arg: TProps) => JSX.Element;

/**
 * Type definition for stateless components without props
 */
export type StatelessComponentWithoutProps<_TProps = undefined> = () => JSX.Element;
/**
 * Type definition for a stateless component
 */
export type StatelessComponent<TProps> = StatelessComponentWithProps<TProps> | StatelessComponentWithoutProps<TProps>;

/**
 * Type definition for an element type that can be a simple component or a stateless component
 */
export type ElementType<TProps = any> = string | StatelessComponent<TProps> | { new(props: TProps): Component<TProps> };

/**
 * Appends a list of items to a HTML element
 * @param el the root element
 * @param children array of items to append
 */
export const appendChild = (el: HTMLElement, children: Array<string | HTMLElement | any[]>) => {
    for (const child of children) {
        if (typeof child === "string") {
            el.innerText += child;
        } else {
            if (child instanceof HTMLElement) {
                el.appendChild(child);
            } else if (child instanceof Array) {
                appendChild(el, child);
            }
        }
    }
};

/**
 * Type guard that checks if an object is a stateless component
 * @param obj The object to check
 */
export const isStatelessComponent = (obj: any): obj is StatelessComponent<any> => {
    return typeof obj === "function";
};

/**
 * Returns a predefined shadow DOM element for the specified component
 * @param component The component constructor
 */
export const getShadowDomElementForComponent = <TProps>(component: { new(props: TProps): Component<TProps> }) => {
    const name = `custom-${component.name.toLowerCase()}`;
    const exists = customElements.get(name);
    if (!exists) {
        customElements.define(name, component);
    }
    return name;
};

/**
 * Factory method that creates a component. This should be configured as a default JSX Factory in tsconfig.
 * @param elementType The type of the element (component or stateless component factory method)
 * @param props The props for the component
 * @param children additional rest parameters will be parsed as children objects
 */
export const createComponent = <TProps>(elementType: ElementType<TProps>, props: TProps, ...children: Array<string | HTMLElement>) => {

    DomObserverService.EnsureStarted();

    let el!: HTMLElement | JSX.Element;
    if (typeof elementType === "string") {
        el = document.createElement(elementType);
        Object.assign(el, props);

        if (props && (props as any).style) {
            const style = (props as any).style as CSSStyleDeclaration;
            for (const styleName of Object.keys(style) as Array<keyof CSSStyleDeclaration>) {
                el.style[styleName as any] = style[styleName];
            }
        }

    } else if (isComponentClass<TProps>(elementType)) {
        const componentInstance = (document.createElement(getShadowDomElementForComponent(elementType))) as Component<TProps>;
        // componentInstance.appendChild(componentInstance.getElement());
        componentInstance.props = props;
        el = componentInstance;
    } else if (isStatelessComponent(elementType)) {
        if (props) {
            el = (elementType as StatelessComponentWithProps<TProps>)(props);
        } else {
            el = (elementType as StatelessComponentWithoutProps<TProps>)();
        }
    }

    if (children) {
        appendChild(el, children);
    }
    return el;
};
