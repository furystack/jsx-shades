import { Component } from "./Component";
import { createComponent, ElementType } from "./ComponentFactory";
import { LocationService } from "./LocationService";

/**
 * Model for custom route types
 */
export interface IRouteType {
    name: string;
    isAvailable: (path: string) => boolean;
    getComponent: () => Promise<ElementType<any>>;
    component?: JSX.Element | HTMLElement;
}

/**
 * Props object for the Router component
 */
export interface IRouterProps {
    allowMultiple?: boolean;
    routes: IRouteType[];
}

/**
 * Router component
 */
export class Router extends Component<IRouterProps> {
    // private readonly element = (<div className="router" ></div>);
    private lastLocation!: string;
    private lastRouteNames: string = "";

    constructor(public props: IRouterProps) {
        super(props);
        LocationService.OnStateChanged(() => this.onLocationChange());
    }

    public onPropsChanged = () => {
        this.onLocationChange();
    }

    private async onLocationChange() {
        const currentLocation = LocationService.GetPath();
        if (currentLocation === this.lastLocation) {
            return;
        }
        this.lastLocation = currentLocation;

        const newRoutes: IRouteType[] = this.props.allowMultiple ?
            this.props.routes.filter((r) => r.isAvailable(this.lastLocation)) :
            [this.props.routes.find((r) => r.isAvailable(this.lastLocation))].filter((r) => r !== undefined) as IRouteType[];
        const newRouteNames = newRoutes.map((r) => r.name).join(";");
        if (newRouteNames === this.lastRouteNames) {
            return;
        }
        this.lastRouteNames = newRouteNames;

        this.innerHTML = "";

        const newComponentsAsync = newRoutes.map(async (newRoute) => {
            if (newRoute.component === undefined) {
                const newElement = await newRoute.getComponent();
                newRoute.component = createComponent(newElement, null);
            }
            return newRoute.component as HTMLElement | JSX.Element;
        });

        const newComponents = await Promise.all(newComponentsAsync);

        for (const component of newComponents) {
            if (component.parentElement === null || component.parentElement !== this) {
                this.appendChild(component);
            }
        }
    }
}
