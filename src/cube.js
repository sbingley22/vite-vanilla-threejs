const Cube = (THREE, scene, index, color = 0x999999, position) => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: color });
  const cube = new THREE.Mesh(geometry, material)
  cube.position.set(...position)
  cube.scale.setScalar(0.25)
  cube.name = "cube" + index
  cube.spinning = true

  scene.add(cube)

  const spin = (x,y,z) => {
    if (!cube.spinning) return

    cube.rotation.x += x;
    cube.rotation.y += y;
    cube.rotation.z += z;
  }

  return { cube, spin }
}

export default Cube