import { Ticker } from "pixi.js";
import { IState } from "..";
import { IScene } from "../../Scenes/types";
import { TestScene } from "../../Scenes/TestScene";
import { app } from "../../main";

export class TestState implements IState {
    private scenes: IScene[] = []

    public async enter() {
        this.scenes.push(new TestScene())
        for (const scene of this.scenes) {
            await scene.initialize()
            app.stage.addChild(scene)
        }
    }

    public async leave() {
        for (const scene of this.scenes) {
            await scene.leave()
        }
    }

    public update(dt: Ticker) {
        for (const scene of this.scenes) {
            scene.update(dt)
        }
    }

}