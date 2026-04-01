// FirstPersonScene.jsx - Escena 3D con movimiento en primera persona
// Permite mirar con el mouse, caminar con WASD, apunta con una cruceta y abrir el puzzle con E.

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import NodePuzzle from '../NodePuzzle/NodePuzzle.jsx'

function FirstPersonScene({ onClose }) {
  const containerRef = useRef(null)
  const controlsRef = useRef(null)
  const doorRef = useRef(null)
  const doorBoxRef = useRef(null)
  const doorOpenRef = useRef(false)
  const [openPuzzle, setOpenPuzzle] = useState(false)
  const [doorOpen, setDoorOpen] = useState(false)
  const [canOpenPuzzle, setCanOpenPuzzle] = useState(false)
  const canOpenRef = useRef(false)

  useEffect(() => {
    if (!containerRef.current) return

    // Escena, cámara y renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 1.7, 5)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x202030)
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0'
    renderer.domElement.style.left = '0'
    containerRef.current.appendChild(renderer.domElement)

    // Luces
    const ambient = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambient)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight.position.set(5, 10, 5)
    scene.add(dirLight)

    // Piso
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x444444 })
    const floorGeo = new THREE.PlaneGeometry(40, 40)
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = 0
    scene.add(floor)

    // Helpers (cuadrícula + ejes) para ver mejor la escena
    const gridHelper = new THREE.GridHelper(40, 40, 0x888888, 0x444444)
    scene.add(gridHelper)
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    // Puerta bloqueada (no se puede traspasar hasta resolver el puzzle)
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    const doorGeo = new THREE.BoxGeometry(3, 3, 0.25)
    const door = new THREE.Mesh(doorGeo, doorMat)
    door.position.set(0, 1.5, -10)
    scene.add(door)
    doorRef.current = door
    doorBoxRef.current = new THREE.Box3().setFromObject(door)

    // Objetos con los que interactuar
    const interactables = []
    // La puerta es interactuable (mira con la cruceta y presiona E para abrir el puzzle)
    interactables.push(door)
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x2266ff })
    for (let i = 0; i < 6; i++) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), boxMat.clone())
      box.position.set((i - 2.5) * 2.5, 0.5, -5 - (i % 2) * 2)
      box.userData.interactable = true
      scene.add(box)
      interactables.push(box)
    }

    // Controles de primera persona
    const controls = new PointerLockControls(camera, renderer.domElement)
    controlsRef.current = controls

    const onClick = () => {
      controls.lock()
    }

    renderer.domElement.addEventListener('click', onClick)

    const velocity = new THREE.Vector3()
    const direction = new THREE.Vector3()
    const move = { forward: false, backward: false, left: false, right: false }

    const onKeyDown = (event) => {
      switch (event.code) {
        case 'KeyW':
          move.forward = true
          break
        case 'KeyS':
          move.backward = true
          break
        case 'KeyA':
          move.left = true
          break
        case 'KeyD':
          move.right = true
          break
        case 'KeyE':
          if (canOpenRef.current) setOpenPuzzle(true)
          break
        case 'KeyQ':
          if (onClose) onClose()
          break
        case 'Escape':
          controls.unlock()
          break
      }
    }

    const onKeyUp = (event) => {
      switch (event.code) {
        case 'KeyW':
          move.forward = false
          break
        case 'KeyS':
          move.backward = false
          break
        case 'KeyA':
          move.left = false
          break
        case 'KeyD':
          move.right = false
          break
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)

    // Raycaster para detectar qué estás apuntando
    const raycaster = new THREE.Raycaster()
    let currentIntersected = null

    const clock = new THREE.Clock()

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', onResize)

    let animationId = null

    const animate = () => {
      const delta = clock.getDelta()
      const prevPosition = camera.position.clone()

      if (controls.isLocked) {
        velocity.x -= velocity.x * 10.0 * delta
        velocity.z -= velocity.z * 10.0 * delta

        direction.z = Number(move.forward) - Number(move.backward)
        direction.x = Number(move.right) - Number(move.left)
        direction.normalize()

        if (move.forward || move.backward) velocity.z -= direction.z * 50.0 * delta
        if (move.left || move.right) velocity.x -= direction.x * 50.0 * delta

        controls.moveRight(-velocity.x * delta)
        controls.moveForward(-velocity.z * delta)
      }

      // Si la puerta está cerrada, bloquea el paso manteniendo la posición previa
      if (!doorOpenRef.current && doorBoxRef.current && doorBoxRef.current.containsPoint(camera.position)) {
        camera.position.copy(prevPosition)
        if (controls.getObject) {
          controls.getObject().position.copy(prevPosition)
        }
      }

      // Raycast en dirección de la cámara
      raycaster.setFromCamera(new THREE.Vector2(0, 0), camera)
      const intersects = raycaster.intersectObjects(interactables, false)
      if (intersects.length > 0 && intersects[0].distance < 5) {
        const hit = intersects[0].object
        if (currentIntersected !== hit) {
          if (currentIntersected) currentIntersected.material.emissive.setHex(0x000000)
          currentIntersected = hit
          currentIntersected.material.emissive.setHex(0xff0000)
        }
        setCanOpenPuzzle(true)
        canOpenRef.current = true
      } else {
        if (currentIntersected) {
          currentIntersected.material.emissive.setHex(0x000000)
          currentIntersected = null
        }
        setCanOpenPuzzle(false)
        canOpenRef.current = false
      }

      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      renderer.domElement.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('resize', onResize)
      controls.dispose()
      renderer.dispose()
      if (animationId) cancelAnimationFrame(animationId)
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  // Efecto para manejar el pointer lock cuando se abre/cierra el puzzle
  useEffect(() => {
    if (openPuzzle && controlsRef.current) {
      // Si se abre el puzzle, libera el pointer lock para poder mover el mouse
      controlsRef.current.unlock()
    }
  }, [openPuzzle])

  // Efecto para controlar la visibilidad de la puerta (se abre al resolver el puzzle)
  useEffect(() => {
    doorOpenRef.current = doorOpen
    if (doorRef.current) {
      doorRef.current.visible = !doorOpen
    }
  }, [doorOpen])

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Puntito central (cruceta) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 10,
          height: 10,
          marginLeft: -5,
          marginTop: -5,
          borderRadius: 2,
          background: canOpenPuzzle ? 'red' : 'white',
          pointerEvents: 'none',
          zIndex: 10
        }}
      />

      {/* Instrucciones */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        color: 'white',
        fontSize: 14,
        zIndex: 10
      }}>
        <div>Click para bloquear el ratón</div>
        <div>WASD para moverte</div>
        <div>Apunta a la puerta y presiona E para abrir el puzzle</div>
        <div>Resuelve el puzzle para desbloquear la puerta</div>
        <div>Esc para soltar el mouse</div>
      </div>

      <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />

      {openPuzzle && <NodePuzzle
        onClose={() => {
          setOpenPuzzle(false)
          // Al cerrar el puzzle, intenta bloquear el pointer lock de nuevo
          if (controlsRef.current && containerRef.current) {
            setTimeout(() => {
              controlsRef.current.lock()
            }, 100)
          }
        }}
        onSolved={() => setDoorOpen(true)}
      />}
    </div>
  )
}

export default FirstPersonScene
