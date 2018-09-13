import { Component } from "../render-engine/Component";
import { ComponentFactory, ElementType } from "../render-engine/ComponentFactory";
import { LocationService } from "../services/location";

export interface IRouteType {
    name: string;
    isAvailable: (path: string) => boolean;
    getComponent: () => Promise<ElementType<any>>;
    component?: JSX.Element | HTMLElement;
}

export interface IRouterProps {
    allowMultiple?: boolean;
    routes: IRouteType[];
}

export class Router extends Component<IRouterProps> {
    // private readonly element = (<div className="router" ></div>);
    private lastLocation!: string;
    private lastRouteNames: string = "";

    constructor(public props: IRouterProps) {
        super();
        LocationService.OnStateChanged(() => this.onLocationChange());
    }

    public onPropsChanged = () => {
        this.onLocationChange();
    }

    // public getElement = () => this.element;

    private async onLocationChange() {
        const currentLocation = LocationService.GetPath();
        if (currentLocation === this.lastLocation) {
            return;
        }
        this.lastLocation = currentLocation;

        const newRoutes: IRouteType[] = this.props.allowMultiple ? this.props.routes.filter((r) => r.isAvailable(this.lastLocation)) : [this.props.routes.find((r) => r.isAvailable(this.lastLocation)) || {} as IRouteType];
        const newRouteNames = newRoutes.map((r) => r.name).join(";");
        if (newRouteNames === this.lastRouteNames) {
            return;
        }
        this.lastRouteNames = newRouteNames;

        this.innerHTML = "";

        const newComponents = newRoutes.map(async (newRoute) => {
            if (newRoute.component === undefined) {
                const newElement = await newRoute.getComponent();
                newRoute.component = ComponentFactory(newElement, null);
            }
            return newRoute.component as HTMLElement | JSX.Element;
        });

        for (const component of newComponents) {
            const c = await component;
            if (c.parentElement === null || c.parentElement !== this) {
                this.appendChild(c);
            }
        }
    }
}
