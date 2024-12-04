import { IPhysicsObj } from "./types";

export class Physics {
    public static isCollision(a: IPhysicsObj, b: IPhysicsObj) {
        const ab = a.boundingBox?.rectangle
        const bb = b.boundingBox?.rectangle

        if (!ab || !bb) return false
        if (
            ab.x < bb.x + bb.width &&
            ab.x + ab.width > bb.x &&
            ab.y < bb.y + bb.height &&
            ab.y + ab.height > bb.y
        ) {

            a.onCollision(b)
            b.onCollision(a)

            return true
        }

        return false
    }
}