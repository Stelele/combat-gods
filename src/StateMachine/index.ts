import { Ticker } from "pixi.js"

export class StateMachine {
    private static curState?: IState

    public static async setState(state: IState) {
        if (this.curState) {
            await this.curState.leave()
        }

        StateMachine.curState = state
        await StateMachine.curState.enter()
    }

    public static update(dt: Ticker) {
        if (!StateMachine.curState) return
        StateMachine.curState.update(dt)
    }
}

export interface IState {
    enter: () => Promise<void>
    leave: () => Promise<void>
    update: (dt: Ticker) => void
}