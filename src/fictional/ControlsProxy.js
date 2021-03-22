import WorkerMessageType from "./WorkerMessageType"

/**
 * @description: Bridge between main and worker
 */
class ControlsProxy {

    /**
     * @param {Worker} worker
     * @param {HTMLElement | null} htmlElement
     * @param {String} [elementID] default value: element
     * @return {void} void
     */
    constructor(worker, htmlElement = null, elementID = 'element') {

        if (!(worker instanceof Worker)) {
            throw new Error('ControlsProxy: the first parameter "worker" is not assignable to type Worker.')
        }

        this.worker = worker
        this.htmlElement = htmlElement
        this.elementID = elementID

        if (htmlElement !== null) {
            if (!(htmlElement instanceof HTMLElement)) {
                throw new Error('ControlsProxy: the second parameter "htmlElement" is not assignable to type HTMLElement.')
            } else {
                this.worker.postMessage({
                    type: WorkerMessageType.MAKE_ELEMENT,
                    id: elementID
                })
            }
        }

    }

    /**
     * @description children must override createInit()
     * @param {OffscreenCanvas} offscreenCanvas
     * @return {void}
     */
    createInit(offscreenCanvas) {
        this.worker.postMessage({
            type: WorkerMessageType.CREATE_INIT,
            id: this.elementID,
            canvas: offscreenCanvas
        }, [offscreenCanvas])

        this.configEventListener()
    }

    /**
     * @abstract
     */
    configEventListener() {
        //children must override listenerToEvent()
    }

    /**
     * @param {{type:string,id:string,event:any}} event
     * @return {vodi} void
     */
    sendEventMessage(event) {
        this.worker.postMessage({
            type: WorkerMessageType.EVENT,
            id: this.elementID,
            event
        })
    }

    /**
     * @abstract
     */
    dispose() {
        this.worker.postMessage({
            type: WorkerMessageType.DISPOSE
        })
    }

    /**
     * @description: pick Object keys by String[]
     * @param {Object} src Object
     * @param {String[]} properties
     * @return {Object} Object
     */
    static copyProperties(src, properties) {
        let result = {}
        properties.forEach(key => {
            result[key] = src[key]
        })
        return result
    }

}

export default ControlsProxy
