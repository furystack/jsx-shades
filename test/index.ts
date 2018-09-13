/** Main entry point for tests */

// tslint:disable

declare var global: any;

global.HTMLElement = class {

}
// tslint:enable

export * from "./ComponentTests";
