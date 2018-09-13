import { createComponent, StatelessComponentWithProps } from "./ComponentFactory";
import { LocationService } from "./LocationService";

/**
 * Model for route props
 */
export interface IRouteProps {
    title: string;
    link: string;
    style?: Partial<CSSStyleDeclaration>;
}

/**
 * Stateless component to define custom route links
 * @param props predefined properties
 */
export const RouteLink: StatelessComponentWithProps<IRouteProps> = (props) => {
    const onClickHandler = (ev: MouseEvent) => {
        ev.preventDefault();
        LocationService.PushState({}, props.title, `#${props.link}`);
    };
    return (<span style={{ ...props.style }} onclick={(ev: MouseEvent) => onClickHandler(ev)}>{props.title}</span>);
};
