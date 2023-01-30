export type Vector3Array = [x: number, y: number, z: number];

export type QuaternionArray = [x: number, y: number, z: number, w: number];

export type WorldPosition = [
  x: number,

  y: number,

  z: number,

  dimension: number,
];

export type WorldPositionRotation = [
  x: number,

  y: number,

  z: number,

  dimension: number,

  rx: number,

  ry: number,

  rz: number,

  rw?: number,
];
