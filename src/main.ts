import axios from "axios"
import { Application, Assets, AssetsManifest } from "pixi.js"
import { StateMachine } from "./StateMachine"
import { TestState } from "./StateMachine/States/TestState"
import { KeyboardInputHandler } from "./InputHandling/KeyboardInputHandler"

export let app: Application
export const appDetails = {
  width: 800,
  height: 600,
  backgroundColor: "#1099bb"
}

init()
async function init() {
  if (app) return

  app = new Application()
  await app.init({
    preference: "webgl",
    hello: true,
    width: appDetails.width,
    height: appDetails.height,
    background: appDetails.backgroundColor
  })

  const manifest: AssetsManifest = (await axios.get('/assets/manifest.json')).data
  await Assets.init({ manifest, basePath: "assets" })

  const bundles = manifest.bundles.map((x) => x.name)
  Assets.backgroundLoadBundle(bundles)

  KeyboardInputHandler.initialize()

  document.body.style.backgroundColor = appDetails.backgroundColor
  document.getElementById("app")?.appendChild(app.canvas)
  window.addEventListener('resize', resize)
  resize()

  StateMachine.setState(new TestState())
  app.ticker.add(StateMachine.update)
}

function resize() {
  const scale = Math.min(
    window.innerWidth / appDetails.width,
    window.innerHeight / appDetails.height,
  )

  const newWidth = scale * appDetails.width
  const newHeight = scale * appDetails.height

  const wMargin = Math.max(window.innerWidth - newWidth, 0) / 2
  const hMargin = Math.max(window.innerHeight - newHeight, 0) / 2

  app.canvas.style.width = `${newWidth}px`
  app.canvas.style.height = `${newHeight}px`
  app.canvas.style.marginTop = `${hMargin > 20 ? hMargin : 0}px`
  app.canvas.style.marginLeft = `${wMargin > 20 ? wMargin : 0}px`
}
