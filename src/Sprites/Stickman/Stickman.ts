import { AnimatedSprite, Assets, Container, Graphics, Texture, Ticker } from "pixi.js";
import axios from "axios";
import { INode } from "../../Scenes/types";
import { StickmanAnimationStateMachine } from "./StickmanStateMachine";
import { appDetails } from "../../main";
import { IPhysicsObj } from "../../Physics/types";
import { GRAVITY } from "../../Physics/Constants";

export class Stickman implements INode, IPhysicsObj {
    public name: string;

    private sprite!: AnimatedSprite
    private animationStateMachine!: StickmanAnimationStateMachine
    private static animations: Record<string, Record<string, Record<string, string[]>>> = {}
    private scene!: Container
    private bb!: Graphics

    private curSkin = "Black"
    private curWeapon = "1_"
    private curAnimation = "idle"
    private prevAnimation = ""

    private isReady = false
    private isCollision = false

    public constructor(scene: Container, name: string) {
        this.animationStateMachine = new StickmanAnimationStateMachine()
        this.scene = scene
        this.name = name
    }

    public get details() {
        return {
            skin: this.curSkin,
            weapon: this.curWeapon,
            animation: this.curAnimation,
        }
    }
    public get boundingBox() {
        if (!this.sprite) return
        return this.sprite.getBounds()
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

        this.sprite.scale = 0.2
        this.sprite.x = appDetails.width / 2
        this.sprite.y = this.sprite.height / 2

        const bounds = this.boundingBox
        if (bounds) {
            this.bb = new Graphics()
                .rect(bounds.x, bounds.y, bounds.width, bounds.height)
                .fill(0xffffff)
            this.bb.alpha = 0.5
            this.scene.addChild(this.bb)
        }

        this.isReady = true
    }

    public async leave() {
        this.scene.removeChild(this.sprite)
    }

    public update(dt: Ticker) {
        if (!this.isReady) return
        this.animationStateMachine.update(this)

        if (this.isCollision) return
        this.sprite.y += GRAVITY * dt.deltaTime
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

    public onCollision<T extends IPhysicsObj>(a: T) {
        this.isCollision = true
    }
}