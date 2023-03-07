export enum ObjectType {
  group = 'group',
  model = 'model',
  gltf = 'gltf',
  box = 'box',
  sphere = 'sphere',
  line = 'line',
  text = 'text',
}

export enum ObjectSource {
  Hosted = 'hosted',
  External = 'external',
}

export enum EntityCollision {
  static = 'static',
  kinematic = 'kinematic',
  dynamic = 'dynamic',
}

export enum EntityCollider {
  sphere = 'sphere',
  box = 'box',
  hull = 'hull',
  trimesh = 'trimesh',
}
