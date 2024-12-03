export class KeyboardInputHandler {
    public static keys: Record<string, boolean> = {}
    private static readonly keyMap: Record<string, string> = {
        "KeyW": "UP",
        "KeyS": "DOWN",
        "KeyA": "LEFT",
        "KeyD": "RIGHT",
        "Space": "JUMP"
    }



    public static initialize() {
        window.addEventListener('keydown', (evt) => {
            if (evt.code in this.keyMap) {
                this.keys[this.keyMap[evt.code]] = true
            }
        })

        window.addEventListener('keyup', (evt) => {
            if (evt.code in this.keyMap) {
                this.keys[this.keyMap[evt.code]] = false
            }
        })
    }
}