import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import Cube from './src/cube'
import Lucy from './src/lucy'

const app = document.querySelector('#app')
const button = document.querySelector('#danger-button')
button.addEventListener("click", ()=>{
  if (lucy2) lucy2.playAnimationByName("Dancing")
})

const scene = new THREE.Scene()
scene.background = null

const camera = new THREE.PerspectiveCamera(75, app.clientWidth / app.clientHeight, 0.1, 1000)
camera.position.set(0,2,2)

const renderer = new THREE.WebGLRenderer({ alpha: true })
renderer.setSize(app.clientWidth, app.clientHeight)
renderer.shadowMap.enabled = true

function resizeRenderer() {
  const width = app.clientWidth
  const height = app.clientHeight
  renderer.setSize(width, height)
}
resizeRenderer()
window.addEventListener("resize", resizeRenderer)

if (app) app.appendChild(renderer.domElement)
else document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 1, 0)

const clock = new THREE.Clock(true)

// Lighting
const ambientLight = new THREE.AmbientLight(0xcccccc, 0.2)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.99)
directionalLight.position.set(2, 3, 4)
directionalLight.castShadow = true
scene.add(directionalLight)

// Click raycasters
renderer.domElement.addEventListener('click', (event) => {
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  const canvasBounds = renderer.domElement.getBoundingClientRect()
  mouse.x = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1
  mouse.y = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(scene.children, true)
  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object    
    //console.log(intersectedObject.name)
    
    if (intersectedObject.name == "Ana") lucy.playAnimationByName("DancingTwirl")
    else if (intersectedObject.name == "cube0") intersectedObject.spinning = !intersectedObject.spinning
    else if (intersectedObject.name == "cube1") intersectedObject.spinning = !intersectedObject.spinning
  }
})

let lucy = Lucy(THREE, GLTFLoader, scene, [-1,0,0])
let lucy2 = Lucy(THREE, GLTFLoader, scene, [1,0,0])

const cubes = [
  Cube(THREE, scene, 0, 0x339933, [-1,-0.5,0]),
  Cube(THREE, scene, 1, 0xFF1133, [1,-0.5,0])
]

function spinCubes() {
  if (!cubes) return
  
  cubes.forEach(cube => {
    cube.spin(0.01,0,0)
  })
}

// Render loop
function animate() {
  requestAnimationFrame(animate)

  var delta = clock.getDelta()

  controls.update()

  spinCubes()

  if (lucy) {
    lucy.updateMixer(delta)
  }
  if (lucy2) {
    lucy2.updateMixer(delta)
  }

  renderer.render(scene, camera)
}

animate()