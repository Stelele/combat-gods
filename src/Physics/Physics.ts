import { Point, Ticker } from "pixi.js";
import { IPhysicsObj } from "./types";
import { IMPULSE_POWER } from "./Constants";

export class Physics {
    public static isCollision(a: IPhysicsObj, b: IPhysicsObj, dt: Ticker) {
        const ab = a.boundingBox
        const bb = b.boundingBox

        if (!ab || !bb) return false
        if (
            ab.x < bb.x + bb.w &&
            ab.x + ab.w > bb.x &&
            ab.y < bb.y + bb.h &&
            ab.y + ab.h > bb.y
        ) {

            a.onCollision(b, dt)
            b.onCollision(a, dt)

            a.isColliding = true
            b.isColliding = true

            return true
        }

        a.isColliding = false
        b.isColliding = false

        return false
    }

    public static collisionResponse(object1: IPhysicsObj, object2: IPhysicsObj) {
        if (!object1 || !object2) {
            return new Point(0);
        }

        const vCollision = new Point(object2.x - object1.x, object2.y - object1.y);

        const distance = Math.sqrt(
            (object2.x - object1.x) * (object2.x - object1.x) +
            (object2.y - object1.y) * (object2.y - object1.y)
        );

        const vCollisionNorm = new Point(vCollision.x / distance, vCollision.y / distance);

        const vRelativeVelocity = new Point(
            object1.acceleration.x - object2.acceleration.x,
            object1.acceleration.y - object2.acceleration.y,
        );

        const speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

        const impulse = (IMPULSE_POWER * speed) / (object1.mass + object2.mass);

        return new Point(impulse * vCollisionNorm.x, impulse * vCollisionNorm.y);
    }
}