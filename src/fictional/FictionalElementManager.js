import FictionalElement from "./FictionalElement"

/**
 * @description: Manage all instances of FictionalElement in worker
 */
class FictionalElementManager {
    constructor() {
        this.targets = new Map()
    }

    /**
     * @description: make and save a FictionalElement by id
     * @param {string} id
     * @return {FictionalElement} FictionalElement
     */
    makeElement(id) {
        const element = new FictionalElement()
        this.targets.set(id, element)
        return element
    }

    /**
     * @param {string} id
     * @return {FictionalElement | undefined}
     */
    getElement(id) {
        return this.targets.get(id)
    }

    /**
     * @param {string} id
     * @return {boolean}
     */    
    hasElement(id) {
        return this.targets.has(id)
    }

    /**
     * @param {string} id
     * @return {boolean}
     */    
    deleteElement(id) {
        return this.targets.delete(id)
    }

    /**
     * @return {void}
     */    
    clear() {
        this.targets.clear()
    }
}

export default FictionalElementManager