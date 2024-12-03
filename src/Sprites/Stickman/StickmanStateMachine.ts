import { KeyboardInputHandler } from "../../InputHandling/KeyboardInputHandler";
import { Stickman } from "./Stickman";

export class StickmanAnimationStateMachine {
    public update(stickMan: Stickman) {
        switch (stickMan.details.animation) {
            case "idle":
                this.handleIdleState(stickMan)
                break
            case "walk normal":
                this.handleWalkState(stickMan)
                break
            case "jump B":
                this.handleJumpState(stickMan)
                break
        }
    }

    private handleIdleState(stickMan: Stickman) {
        if (KeyboardInputHandler.keys["RIGHT"]) {
            stickMan.setAnimation("walk normal")
            stickMan.faceDirection(1)
        }

        if (KeyboardInputHandler.keys["LEFT"]) {
            stickMan.setAnimation("walk normal")
            stickMan.faceDirection(-1)
        }

        if (KeyboardInputHandler.keys["JUMP"]) {
            stickMan.playAnimationOnce("jump B")
        }
    }

    private handleWalkState(stickMan: Stickman) {
        if (!(
            KeyboardInputHandler.keys["LEFT"] ||
            KeyboardInputHandler.keys["RIGHT"]
        )) {
            stickMan.setAnimation("idle")
        }

        if (KeyboardInputHandler.keys["LEFT"]) {
            stickMan.faceDirection(-1)
        }

        if (KeyboardInputHandler.keys["RIGHT"]) {
            stickMan.faceDirection(1)
        }

        if (KeyboardInputHandler.keys["JUMP"]) {
            stickMan.playAnimationOnce("jump B")
        }
    }

    private handleJumpState(stickMan: Stickman) {

    }

}