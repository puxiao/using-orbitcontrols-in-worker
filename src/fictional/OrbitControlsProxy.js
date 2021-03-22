import ControlsProxy from "./ControlsProxy"
import WorkerMessageType from "./WorkerMessageType"

const mouseEventProperties = ['type', 'pointerType', 'button', 'clientX', 'clientY', 'ctrlKey', 'metaKey', 'shiftKey']
const wheelEventProperties = ['type', 'deltaY']
const keyboardEventProperties = ['type', 'code', 'keyCode']
const touchEventProperties = ['type']
const touchProperties = ['pageX', 'pageY']

/**
 * @description: OrbitControls Proxy
 */
class OrbitControlsProxy extends ControlsProxy {

    /**
     * @param {Worker} worker
     * @param {HTMLElement} htmlElement
     * @param {String} [elementID] default value: element
     * @return {void} void
     */
    constructor(worker, htmlElement, elementID = 'element') {
        super(worker, htmlElement, elementID)
    }

    handleResize = () => {

        const rect = this.htmlElement.getBoundingClientRect()
        const fictitiousEvent = {
            type: WorkerMessageType.RESIZE,
            id: this.elementID,
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        }
        this.worker.postMessage(fictitiousEvent)
    }

    /**
     * @param {PointerEvent} event
     * @return {void} void
     */
    handlePointerDown = (event) => {
        event.preventDefault();

        switch (event.pointerType) {

            case 'mouse':
            case 'pen':
                this.handleMouseDown(event);
                break;
            default:
                // TODO touch
                break

        }
    }

    /**
     * @param {PointerEvent} event
     * @return {void} void
     */
    handlePointerMove = (event) => {
        event.preventDefault();

        switch (event.pointerType) {

            case 'mouse':
            case 'pen':
                this.handleMouseMove(event);
                break;
            default:
                // TODO touch
                break
        }
    }

    /**
     * @param {PointerEvent} event
     * @return {void} void
     */
    handlePointerUp = (event) => {
        event.preventDefault();

        switch (event.pointerType) {

            case 'mouse':
            case 'pen':
                this.handleMouseUp(event);
                break;
            default:
                // TODO touch
                break

        }
    }

    /**
     * @param {MouseEvent} event
     * @return {void} void
     */
    handleMouseDown = (event) => {
        // Prevent the browser from scrolling.
        event.preventDefault();

        this.htmlElement.ownerDocument.addEventListener('pointermove', this.handlePointerMove);
        this.htmlElement.ownerDocument.addEventListener('pointerup', this.handlePointerUp);

        const fictitiousEvent = ControlsProxy.copyProperties(event, mouseEventProperties)
        this.sendEventMessage(fictitiousEvent)
    }


    /**
     * @param {MouseEvent} event
     * @return {void} void
     */
    handleMouseMove = (event) => {
        event.preventDefault();

        const fictitiousEvent = ControlsProxy.copyProperties(event, mouseEventProperties)
        this.sendEventMessage(fictitiousEvent)
    }

    /**
     * @param {MouseEvent} event
     * @return {void} void
     */
    handleMouseUp = (event) => {
        event.preventDefault();

        this.htmlElement.ownerDocument.removeEventListener('pointermove', this.handlePointerMove);
        this.htmlElement.ownerDocument.removeEventListener('pointerup', this.handlePointerUp);

        const fictitiousEvent = ControlsProxy.copyProperties(event, mouseEventProperties)
        this.sendEventMessage(fictitiousEvent)
    }

    /**
     * @param {WheelEvent} event
     * @return {void} void
     */
    handleWheelEvent = (event) => {
        event.preventDefault()

        const fictitiousEvent = ControlsProxy.copyProperties(event, wheelEventProperties)
        this.sendEventMessage(fictitiousEvent)
    }

    /**
     * @param {KeyboardEvent} event
     * @return {void} void
     */
    handleKeyboardEvent = (event) => {
        event.preventDefault()

        const fictitiousEvent = ControlsProxy.copyProperties(event, keyboardEventProperties)
        this.sendEventMessage(fictitiousEvent)
    }

    /**
     * @param {TouchEvent} event
     * @return {void} void
     */
    handleTouchEvent = (event) => {
        event.preventDefault()

        const fictitiousEvent = ControlsProxy.copyProperties(event, touchEventProperties)

        let touches = []
        for (const touch of event.touches) {
            touches.push(ControlsProxy.copyProperties(touch, touchProperties))
        }
        fictitiousEvent.touches = touches

        this.sendEventMessage(fictitiousEvent)
    }

    // /**
    //  * @override createInit
    //  * @param {OffscreenCanvas} offscreenCanvas
    //  * @return {void}
    //  */
    // createInit(offscreenCanvas) {
    //     super.createInit(offscreenCanvas)
    // }

    /**
     * @override configEventListener
     * @return {void} void
     */
    configEventListener() {
        this.handleResize()
        window.addEventListener('resize', this.handleResize, { capture: true, passive: false })
        this.htmlElement.addEventListener('pointerdown', this.handlePointerDown, { capture: true, passive: false })
        this.htmlElement.addEventListener('wheel', this.handleWheelEvent, { capture: true, passive: false })
        this.htmlElement.addEventListener('keydown', this.handleKeyboardEvent, { capture: true, passive: false })
        this.htmlElement.addEventListener('keyup', this.handleKeyboardEvent, { capture: true, passive: false })
        this.htmlElement.addEventListener('touchstart', this.handleTouchEvent, { capture: true, passive: false })
        this.htmlElement.addEventListener('touchmove', this.handleTouchEvent, { capture: true, passive: false })
        this.htmlElement.addEventListener('touchend', this.handleTouchEvent, { capture: true, passive: false })
    }

    /**
     * @override dispose()
     * @return {void} void
     */
    dispose() {

        super.dispose()

        window.removeEventListener('resize', this.handleResize)
        this.htmlElement.removeEventListener('pointerdown', this.handlePointerDown)
        this.htmlElement.ownerDocument.removeEventListener('pointermove', this.handlePointerMove);
        this.htmlElement.ownerDocument.removeEventListener('pointerup', this.handlePointerUp);
        this.htmlElement.removeEventListener('wheel', this.handleWheelEvent)
        this.htmlElement.removeEventListener('keydown', this.handleKeyboardEvent)
        this.htmlElement.removeEventListener('keyup', this.handleKeyboardEvent)
        this.htmlElement.removeEventListener('touchstart', this.handleTouchEvent)
        this.htmlElement.removeEventListener('touchmove', this.handleTouchEvent)
        this.htmlElement.removeEventListener('touchend', this.handleTouchEvent)
    }
}

export default OrbitControlsProxy