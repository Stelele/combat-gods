import { Container, Ticker } from "pixi.js";
import { INode } from "./types";
import { Stickman } from "../Sprites/Stickman/Stickman";
import { Platform } from "../Sprites/Platform/Platform";
import { appDetails } from "../main";
import { Physics } from "../Physics/Physics";

export class TestScene extends Container implements INode {
    private stickman: Stickman
    private platform: Platform
    private assetsReady = false

    public constructor() {
        super()
        this.stickman = new Stickman(this, "Hero")
        this.platform = new Platform(
            0, appDetails.height - 50,
            appDetails.width, 50,
            this, "Ground"
        )
    }

    public async initialize() {
        await this.stickman.initialize()
        this.assetsReady = true
    }

    public async leave() {

    }

    public update(dt: Ticker) {
        if (!this.assetsReady) return
        this.stickman.update(dt)
        Physics.isCollision(this.stickman, this.platform, dt)
    }
}