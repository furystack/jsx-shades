import { expect } from "chai";
import { Test } from "mocha";
import { Component } from "../src/Component";
import { createComponent, getShadowDomElementForComponent, isStatelessComponent } from "../src/ComponentFactory";

class TestComponent extends Component<any> { }

declare var global: any;
global.document = {} as any;

/**
 * Component Factory tests
 */
export const componentFactoryTests = describe("Component Factory", () => {
    /** */
    describe("Type guards", () => {
        describe("isStatelessComponent", () => {
            it("Should return true for methods", () => {
                expect(isStatelessComponent(() => null)).to.be.eq(true);
            });

            it("Should return false for non-methods", () => {
                expect(isStatelessComponent("test")).to.be.eq(false);
            });
        });
    });

    describe("getShadowDomElementForComponent", () => {
        it("Should register non-registered values", () => {
            getShadowDomElementForComponent(TestComponent);
        });

        it("Should return registered values", () => {
            const a = getShadowDomElementForComponent(TestComponent);
            const b = getShadowDomElementForComponent(TestComponent);
            expect(a).to.be.eq(b);
        });
    });

    describe("CreateComponent", () => {
        it("Should create native components from strings", (done: MochaDone) => {
            global.document.createElement = (elementType: string) => {
                expect(elementType).to.be.eq("div");
                done();
                return {};
            };
            createComponent("div", undefined);
        });

        it("Should apply styles for the native components", () => {
            global.document.createElement = (elementType: string) => {
                // tslint:disable-next-line:max-classes-per-file
                return new class { /** */ }();
            };
            const c = createComponent("div", { style: { color: "red" } });
            expect(c.style.color).to.be.eq("red");
        });

        it("Should create components from component types", () => {
            global.document.createElement = () => {
                /**  */
                return new TestComponent(undefined);
            };
            const props = { value: 1 };
            const c = createComponent(TestComponent, props);
            expect(c).to.be.instanceof(TestComponent);
            expect((c as TestComponent).props).to.be.eq(props);
        });

        it("Should create components from stateless components without props", () => {
            global.document.createElement = () => {
                return new TestComponent(undefined);
            };
            const s = () => (<div></div>);
            const c = createComponent(s, undefined);
        });

        it("Should create components from stateless components with props", () => {
            global.document.createElement = () => {
                return new TestComponent(undefined);
            };
            const s = (props: { value: number }) => (<div>{props.value}</div>);
            const p = { value: 1 };
            const c = createComponent(s, p);
        });
    });
});
