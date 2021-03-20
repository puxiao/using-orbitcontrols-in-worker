import { EventDispatcher } from "three"


/**
 * @description: no operate, for event.preventDefault、event.stopPropagation
 */
const noOperate = () => { }


/**
 * @description: Fictional HTMLElement for web worker
 * @extends EventDispatcher
 */
class FictionalElement extends EventDispatcher {
    constructor() {
        super()
       
        this.ownerDocument = this

        this.top = 0
        this.left = 0
        this.width = 0
        this.height = 0

    }

    get clientWidth() {
        return Math.round(this.width)
    }

    get clientHeight() {
        return Math.round(this.height)
    }

    getBoundingClientRect() {
        return {
            top: this.top,
            left: this.left,
            width: this.width,
            height: this.height,
            right: this.left + this.width,
            bottom: this.top + this.height
        }
    }

    focus() {
        //no operate
    }

    /**
     * @description: override dispatchEvent
     * @param {{type:string,[key:string]:any}} event
     */
    dispatchEvent(event) {
        if (event.type === 'resize') {
            this.left = event.left
            this.top = event.top
            this.width = event.width
            this.height = event.height
            //return
        }

        event.preventDefault = noOperate
        event.stopPropagation = noOperate

        super.dispatchEvent(event)
    }

}

export default FictionalElement