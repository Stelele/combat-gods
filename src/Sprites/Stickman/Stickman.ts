import { AnimatedSprite, Assets, Container, Graphics, Point, Texture, Ticker } from "pixi.js";
import axios from "axios";
import { INode } from "../../Scenes/types";
import { StickmanAnimationStateMachine } from "./StickmanStateMachine";
import { appDetails } from "../../main";
import { IPhysicsObj } from "../../Physics/types";
import { GRAVITY, TERMINAL_VELOCITY } from "../../Physics/Constants";
import { KeyboardInputHandler } from "../../InputHandling/KeyboardInputHandler";

export class Stickman implements INode, IPhysicsObj {
    public name: string;

    private sprite!: AnimatedSprite
    private animationStateMachine!: StickmanAnimationStateMachine
    private static animations: Record<string, Record<string, Record<string, string[]>>> = {}
    private scene!: Container

    private bb!: Graphics
    public showBoundingBox = false
    public isColliding = false

    private curSkin = "Black"
    private curWeapon = "1_"
    private curAnimation = "idle"
    private prevAnimation = ""

    private isReady = false

    public acceleration!: Point
    public velocity!: Point
    public mass!: number

    private MOVE_SPEED = 5
    private isJumping = false

    public constructor(scene: Container, name: string) {
        this.animationStateMachine = new StickmanAnimationStateMachine()
        this.scene = scene
        this.name = name
    }

    public get x() { return this.sprite.x }
    public get y() { return this.sprite.y }
    public get details() {
        return {
            skin: this.curSkin,
            weapon: this.curWeapon,
            animation: this.curAnimation,
        }
    }
    public get boundingBox() {
        const bounds = this.sprite.getBounds().rectangle

        if (this.showBoundingBox) {
            if (this.bb) {
                this.scene.removeChild(this.bb)
                this.bb.destroy()
            }

            this.bb = new Graphics()
                .rect(bounds.x, bounds.y, bounds.width, bounds.height)
                .fill(0xffffff)
            this.bb.alpha = 0.3
            this.scene.addChild(this.bb)
        }

        return {
            x: bounds.x,
            y: bounds.y,
            w: bounds.width,
            h: bounds.height - 5,
        }
    }

    public async initialize() {
        if (this.sprite) return

        await Assets.loadBundle(this.curSkin)
        if (!Object.keys(Stickman.animations).length) {
            Stickman.animations = (await axios.get("/stickman-animations.json")).data
        }

        this.sprite = new AnimatedSprite(this.getTextures())
        this.sprite.anchor = 0.5
        this.scene.addChild(this.sprite)

        this.sprite.animationSpeed = 0.5
        this.sprite.play()

        this.sprite.width = 253
        this.sprite.height = 216
        this.sprite.x = appDetails.width / 2
        this.sprite.y = this.sprite.height / 2

        this.mass = 1
        this.acceleration = new Point(0, GRAVITY)
        this.velocity = new Point(0, GRAVITY)

        this.isReady = true
    }

    public async leave() {
        this.scene.removeChild(this.sprite)
    }

    public update(dt: Ticker) {
        if (!this.isReady) return
        this.animationStateMachine.update(this)

        this.velocity.y = Math.min(this.acceleration.y * dt.deltaTime, TERMINAL_VELOCITY)
        this.sprite.y += this.velocity.y * dt.deltaTime

        this.handleMovement(dt)
    }

    public async setSkin(newSkin: string) {
        if (!this.sprite) {
            await this.initialize()
        }

        this.curSkin = newSkin
        await Assets.loadBundle(newSkin)

        this.sprite.textures = this.getTextures()
        this.sprite.play()

        return this
    }

    public async setWeapon(weapon: string) {
        if (!this.sprite) {
            await this.initialize()
        }

        this.curWeapon = weapon
        this.sprite.textures = this.getTextures()
        this.sprite.play()

        return this
    }

    public async setAnimation(animation: string) {
        if (!this.sprite) {
            await this.initialize()
        }

        this.curAnimation = animation
        this.sprite.textures = this.getTextures()

        this.sprite.loop = true
        this.sprite.play()

        return this
    }

    public async playAnimationOnce(animation: string) {
        if (!this.sprite) {
            await this.initialize()
        }

        this.prevAnimation = this.curAnimation
        this.curAnimation = animation
        this.sprite.textures = this.getTextures()
        this.sprite.loop = false
        this.sprite.onComplete = (async () => {
            await this.setAnimation(this.prevAnimation)
            this.prevAnimation = ""
            this.sprite.onComplete = undefined
        }).bind(this)

        this.sprite.play()
    }

    public faceDirection(x: number) {
        if (x > 0) {
            this.sprite.scale.x = Math.abs(this.sprite.scale.x)
        }
        if (x < 0) {
            this.sprite.scale.x = -1 * Math.abs(this.sprite.scale.x)
        }
    }

    private getTextures() {
        const textures: Texture[] = []
        const frames = Stickman.animations[this.curSkin][this.curWeapon][this.curAnimation].sort()
        for (const image of frames) {
            textures.push(Texture.from(image))
        }

        return textures
    }

    public onCollision<T extends IPhysicsObj>(a: T, dt: Ticker) {
        this.acceleration.y -= this.acceleration.y
        const bottom = this.boundingBox.y + this.boundingBox.h
        const diff = bottom - a.boundingBox.y
        if (diff > 2) {
            this.sprite.y -= diff - 5
        }
    }

    private handleMovement(dt: Ticker) {
        if (KeyboardInputHandler.keys["RIGHT"]) {
            this.sprite.x += this.MOVE_SPEED * dt.deltaTime
        }

        if (KeyboardInputHandler.keys["LEFT"]) {
            this.sprite.x -= this.MOVE_SPEED * dt.deltaTime
        }

        if (KeyboardInputHandler.keys["JUMP"] && this.isColliding) {
            this.sprite.y -= 20 * GRAVITY * dt.deltaTime
            this.acceleration.y = GRAVITY

        }
    }
}