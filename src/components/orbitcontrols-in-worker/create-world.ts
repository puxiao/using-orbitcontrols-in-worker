import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

class CreateWorld {

    renderer: Three.WebGLRenderer
    scene: Three.Scene
    camera: Three.PerspectiveCamera
    canvas: HTMLCanvasElement | OffscreenCanvas
    htmlElement: unknown

    constructor(canvas: HTMLCanvasElement | OffscreenCanvas, htmlElement: unknown) {

        this.canvas = canvas
        this.htmlElement = htmlElement

        this.renderer = new Three.WebGLRenderer({ canvas })
        this.scene = new Three.Scene()
        this.camera = new Three.PerspectiveCamera(45, 2, 0.1, 100)
        this.camera.position.z = 4

        const controls = new OrbitControls(this.camera, htmlElement as HTMLElement)
        controls.listenToKeyEvents(htmlElement as HTMLElement)
        controls.update()

        const colors = ['blue', 'red', 'green']
        const cubes = colors.map((color, index) => {
            const geometry = new Three.BoxBufferGeometry(1, 1, 1)
            const material = new Three.MeshPhongMaterial({ color })
            const mesh = new Three.Mesh(geometry, material)
            mesh.position.x = (index - 1) * 2
            this.scene.add(mesh)
            return mesh
        })

        const light = new Three.DirectionalLight(0xFFFFFF, 1)
        light.position.set(-2, 2, 2)
        this.scene.add(light)

        const render = (time: number) => {
            time *= 0.001
            cubes.forEach(mesh => {
                mesh.rotation.set(time, time, 0)
            })
            this.renderer.render(this.scene, this.camera)
            self.requestAnimationFrame(render)
        }
        self.requestAnimationFrame(render)

        this.handleResize()
        self.window.addEventListener('resize', this.handleResize)
    }

    handleResize = () => {
        const element = this.htmlElement as HTMLElement

        const width = element.clientWidth
        const height = element.clientHeight

        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height, false)
    }

    dispose() {
        self.window.removeEventListener('resize', this.handleResize)
    }
}

export default CreateWorld