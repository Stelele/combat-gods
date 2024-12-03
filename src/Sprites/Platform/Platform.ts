import { Container, Graphics } from "pixi.js";
import { IPhysicsObj } from "../../Physics/types";

export class Platform extends Graphics implements IPhysicsObj {
    private scene: Container
    public name: string

    public constructor(x: number, y: number, w: number, h: number, scene: Container, name: string) {
        super()
        this.rect(x, y, w, h)
            .fill(0xff0000)

        this.scene = scene
        this.name = name
        this.scene.addChild(this)
    }

    public get boundingBox() {
        return {
            x: this.x,
            y: this.y,
            w: this.width,
            h: this.height,
        }
    }

    public onCollision<T extends IPhysicsObj>(a: T) {

    }
}