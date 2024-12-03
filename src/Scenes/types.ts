import { Container, Ticker } from "pixi.js";

export interface INode {
    initialize: () => Promise<void>
    leave: () => Promise<void>
    update: (dt: Ticker) => void
}

export type IScene = Container & INode