export interface IPhysicsObj {
    name: string
    boundingBox?: { x: number; y: number; w: number; h: number }
    onCollision: <T extends IPhysicsObj>(a: T) => void
}