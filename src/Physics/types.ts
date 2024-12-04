import { Bounds } from "pixi.js"

export interface IPhysicsObj {
    name: string
    boundingBox?: Bounds //{ x: number; y: number; w: number; h: number }
    onCollision: <T extends IPhysicsObj>(a: T) => void
}