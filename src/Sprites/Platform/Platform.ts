import { Container, Graphics, Point, Ticker } from "pixi.js";
import { IPhysicsObj } from "../../Physics/types";

export class Platform extends Graphics implements IPhysicsObj {
    private scene: Container
    public name: string

    public isColliding = false

    public acceleration: Point
    public velocity: Point
    public mass: number

    public constructor(x: number, y: number, w: number, h: number, scene: Container, name: string) {
        super()
        this.rect(0, 0, w, h)
            .fill(0xff0000)

        this.scene = scene
        this.name = name
        this.scene.addChild(this)

        this.x = x
        this.y = y

        this.acceleration = new Point(0, 0)
        this.velocity = new Point(0, 0)
        this.mass = 1
    }

    public get boundingBox() {
        const bounds = this.getBounds()

        return {
            x: bounds.x,
            y: bounds.y,
            w: bounds.width,
            h: bounds.height,
        }
    }

    public onCollision<T extends IPhysicsObj>(a: T, dt: Ticker) {

    }
}