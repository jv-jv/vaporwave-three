import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import gsap from "gsap"

import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Loader
const TEXTURE_PATH =
  "https://res.cloudinary.com/dg5nsedzw/image/upload/v1641657168/blog/vaporwave-threejs-textures/grid.png"
const textureLoader = new THREE.TextureLoader()
const gridTexture = textureLoader.load("/texture/grid-texture.png")
// const terrainTexture = textureLoader.load("/texture/displacementmap.webp");
const terrainTexture = textureLoader.load("/texture/displacementmap2.png")

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Scene
const scene = new THREE.Scene()

// Object

const planeGeometry = new THREE.PlaneGeometry(1, 2, 24, 24)
const planeMaterial = new THREE.MeshStandardMaterial({
  // color: "white",
  // wireframe: true,
  // side: THREE.DoubleSide,
  map: gridTexture,
  displacementMap: terrainTexture,
  displacementScale: 0.3,
})

const plane = new THREE.Mesh(planeGeometry, planeMaterial)

plane.rotation.x = -Math.PI * 0.5
plane.position.y = 0.0
plane.position.z = 0.15

const movePlane = ({ direction }) => {
  const scrollAmout = 0.3
  const zModifier = direction ? scrollAmout : -1 * scrollAmout
  gsap.to(plane.position, { z: plane.position.z + zModifier })
}

let touchStartClientY = 0
document.addEventListener("touchstart", ({ changedTouches }) => {
  touchStartClientY = changedTouches[0].clientY
})

document.addEventListener("touchmove", ({ changedTouches }) => {
  const isScrollingDown = changedTouches[0].clientY > touchStartClientY
  movePlane({ direction: isScrollingDown })
})

document.addEventListener("wheel", ({ deltaY }) => {
  movePlane({ direction: deltaY > 1 })
})

scene.add(plane)

const ambientLight = new THREE.AmbientLight("#ffffff", 10)
scene.add(ambientLight)
// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
// camera.position.x = 0;
// camera.position.y = 0.25;
// camera.position.z = 1;
camera.position.x = 0
camera.position.y = 0.1
camera.position.z = 1.1
camera.lookAt(plane.position)
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableZoom = false;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})

renderer.setSize(sizes.width, sizes.height)

window.addEventListener("resize", () => {
  sizes.height = window.innerHeight

  // Update camera's aspect ratio and projection matrix

  camera.aspect = sizes.width / sizes.height

  // camera.updateProjectionMatrix();

  // Update renderer

  renderer.setSize(sizes.width, sizes.height)

  // Note: We set the pixel ratio of the renderer to at most 2

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Animate
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
