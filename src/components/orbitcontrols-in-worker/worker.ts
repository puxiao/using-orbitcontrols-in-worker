import FictionalElementManager from "../../fictional/FictionalElementManager"
import FictionalWindow from "../../fictional/FictionalWindow"
import WorkerMessageType from "../../fictional/WorkerMessageType"
import CreateWorld from "./create-world"

//@ts-ignore
self.document = {}

//@ts-ignore
self.window = new FictionalWindow()

const elementManager = new FictionalElementManager()

let createWorld: CreateWorld

const handleMakeElement = (data: { type: string, id: string }) => {
    elementManager.makeElement(data.id)
}

const handleCreateInit = (data: { type: string, id: string, canvas: OffscreenCanvas }) => {
    const element = elementManager.getElement(data.id)
    createWorld = new CreateWorld(data.canvas, element)
}

const handleResize = (data: { type: string, id: string }) => {

    //update htmlElement size
    const element = elementManager.getElement(data.id)
    element?.dispatchEvent(data)

    //self.window dispatche resize event
    //@ts-ignore
    self.window.dispatchEvent(data)

}

const handleEvent = (data: { type: string, id: string, event: { type: string, [key: string]: any } }) => {
    const element = elementManager.getElement(data.id)
    element?.dispatchEvent(data.event)
}


/**
 * @param {any} _ placeholder
 */
const handleDispose = (_: any) => {
    createWorld.dispose()
}

const handleCustom = (data: any) => {
    console.warn('Worker: you must override handleCustom.')
    console.warn(data)
}

const messageEventHandlers = new Map()
messageEventHandlers.set(WorkerMessageType.MAKE_ELEMENT, handleMakeElement)
messageEventHandlers.set(WorkerMessageType.CREATE_INIT, handleCreateInit)
messageEventHandlers.set(WorkerMessageType.RESIZE, handleResize)
messageEventHandlers.set(WorkerMessageType.EVENT, handleEvent)
messageEventHandlers.set(WorkerMessageType.DISPOSE, handleDispose)

const handleMessageEvent = (event: MessageEvent<{ type: string,[key:string]:any }>) => {

    const handler = messageEventHandlers.get(event.data.type)

    if (handler !== undefined) {
        handler(event.data)
    } else {
        handleCustom(event.data)
    }
}

const handleMessageError = (event: MessageEvent) => {
    console.error(event)
}

self.addEventListener('message', handleMessageEvent)
self.addEventListener('messageerror', handleMessageError)

export { }