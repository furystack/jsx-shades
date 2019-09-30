type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U2>
    ? ReadonlyArray<DeepPartial<U2>>
    : DeepPartial<T[P]>
}
// ToDo: Check eslint error
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace JSX {
  interface Element extends HTMLElement {
    onAttached?: () => void
    onDetached?: () => void
  }

  interface IntrinsicElements {
    div: DeepPartial<HTMLDivElement>
    span: DeepPartial<HTMLSpanElement>
    input: DeepPartial<HTMLInputElement>
    h1: DeepPartial<HTMLHeadingElement>
    h2: DeepPartial<HTMLHeadingElement>
    h3: DeepPartial<HTMLHeadingElement>
    h4: DeepPartial<HTMLHeadingElement>
    h5: DeepPartial<HTMLHeadingElement>
    a: DeepPartial<HTMLAnchorElement>
    p: DeepPartial<HTMLParagraphElement>
    style: DeepPartial<HTMLStyleElement>
    br: DeepPartial<HTMLBRElement>
    textarea: DeepPartial<HTMLTextAreaElement>
  }
}
