import { useEffect, useRef } from 'react'
import Worker from 'worker-loader!./worker'
import OrbitControlsProxy from '../../fictional/OrbitControlsProxy'
import CreateWorld from './create-world'

import './index.css'

const OrbitControlsInWorker = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const workerRef = useRef<Worker | null>(null)
    const createWorldRef = useRef<CreateWorld | null>(null)
    const proxyRef = useRef<OrbitControlsProxy | null>(null)

    const startWorker = () => {
        if (canvasRef.current === null) { return }

        workerRef.current = new Worker()

        const offscreenCanvas = canvasRef.current.transferControlToOffscreen()

        proxyRef.current = new OrbitControlsProxy(workerRef.current, document.body)
        proxyRef.current.createInit(offscreenCanvas)

    }

    const startMain = () => {
        if (canvasRef.current === null) { return }
        createWorldRef.current = new CreateWorld(canvasRef.current, document.body)
    }

    useEffect(() => {

        if (canvasRef.current === null) { return }

        //@ts-ignore
        if (canvasRef.current.transferControlToOffscreen) {
            console.log('start in worker')
            startWorker()
        } else {
            console.log('start in main')
            startMain()
        }

        return () => {
            if (proxyRef.current !== null) {
                proxyRef.current.dispose()
            }
            if (workerRef.current !== null) {
                workerRef.current.terminate()
            }
            if (createWorldRef.current !== null) {
                createWorldRef.current.dispose()
            }
        }

    }, [canvasRef])

    return (
        <canvas ref={canvasRef} className='full-screen' tabIndex={0} />
    )
}

export default OrbitControlsInWorker