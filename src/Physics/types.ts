import { Point, Ticker } from "pixi.js"

export interface IPhysicsObj {
    name: string
    boundingBox: { x: number; y: number; w: number; h: number }
    onCollision: <T extends IPhysicsObj>(a: T, dt: Ticker) => void

    isColliding: boolean

    acceleration: Point
    velocity: Point
    mass: number
    x: number
    y: number
}