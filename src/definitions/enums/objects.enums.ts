export enum ObjectType {
  group = 'group',
  model = 'model',
  gltf = 'gltf',
  box = 'box',
  sphere = 'sphere',
  capsule = 'capsule',
  cylinder = 'cylinder',
  circle = 'circle',
  cone = 'cone',
  torus = 'torus',
  plane = 'plane',
  tetrahedron = 'tetrahedron',
  dodecahedron = 'dodecahedron',
  octahedron = 'octahedron',
  icosahedron = 'icosahedron',
  line = 'line',
  text = 'text',
  spotlight = 'spotlight',
  pointlight = 'pointlight',
  rectarealight = 'rectarealight',
}

export enum ObjectSource {
  Hosted = 'hosted',
  External = 'external',
}

export enum EntityCollision {
  static = 'static',
  kinematicPosition = 'kinematicPosition',
  kinematicVelocity = 'kinematicVelocity',
  dynamic = 'dynamic',
}

export enum EntityCollider {
  sphere = 'sphere',
  box = 'box',
  hull = 'hull',
  trimesh = 'trimesh',
}
