import {Euler, Quaternion, Vector3} from 'three';

import {degToRad, radToDeg} from 'three/src/math/MathUtils';

import {PlayerControls} from 'engine/definitions/types/controls.types';
import {PlayerEntity} from 'engine/definitions/types/entities.types';
import {PlayerEventMap} from 'engine/definitions/types/events.types';
import {
  QuaternionArray,
  Vector3Array,
} from 'engine/definitions/types/world.types';
import EngineManager from 'engine/managers/engine.manager';

import EntityManager from '../../entity/entity.manager';
import PlayerCameraManager from './player-camera.manager';
import type PlayerHandleManager from './player-handle.manager';
import PlayerMessengerManager from './player-messenger.manager';
import PlayerVoicechatManager from './player-voicechat.manager';

class PlayerManager extends EntityManager<
  PlayerEntity,
  PlayerHandleManager,
  PlayerEventMap
> {
  /* accessors */
  private _local_messenger: PlayerMessengerManager = null!;

  get messenger() {
    return this._local_messenger ?? this.engine.messenger;
  }

  voicechat: PlayerVoicechatManager;

  camera: PlayerCameraManager = null!;

  controls: PlayerControls = {
    forward: false,
    backward: false,
    left: false,
    right: false,

    jump: false,
    sprint: false,

    // others
    caps: false,
    alt: false,
    control: false,
  };

  get isMovingControl() {
    return (
      this.controls.forward ||
      this.controls.backward ||
      this.controls.left ||
      this.controls.right
    );
  }

  get name() {
    return this.data.name ?? `Player ${this.id}`;
  }

  get roles() {
    return this.data.roles ?? [];
  }

  private set roles(roles: string[]) {
    this.data.roles = roles;
  }

  get onGround() {
    return this.handle?.onGround;
  }

  get state() {
    return this.handle?.state;
  }

  get isControlling() {
    return !!this.data?.controls;
  }

  get velocity() {
    return this.handle.velocity;
  }

  private get _serverCommands() {
    return this.engine.network.serverCommands;
  }

  constructor(entity: PlayerEntity, engine: EngineManager) {
    super(entity, engine);

    this.voicechat = new PlayerVoicechatManager(this);

    if (engine.isServer) {
      this._local_messenger = new PlayerMessengerManager(this);
    }

    if (engine.isServer || this.isControlling) {
      this.camera = new PlayerCameraManager(this);
    }
  }

  hasAccess(command: string): boolean {
    if (this.engine.api.isWebServer) {
      throw new Error('player.hasAccess is not available on WebServer');
    }

    const roles = this._serverCommands.get(command)?.roles;

    // if no roles are assigned,
    // then everyone has access
    if (!roles?.length) return true;

    return this.roles.some(e => roles.includes(e));
  }

  updateName(name: string) {
    this.data.name = name;
  }

  updateRoles(roles: string[]) {
    this.data.roles = roles;
  }

  setName(name: string) {
    this.messenger.emit('setPlayerName', [this.id, name]);
  }

  addRole(roleId: string) {
    this.messenger.emit('addPlayerRole', [this.id, roleId]);
  }

  removeRole(roleId: string) {
    this.messenger.emit('removePlayerRole', [this.id, roleId]);
  }

  setDimension(dimension: number) {
    if (!this.engine.api.isServer) {
      throw new Error('player.setDimension is only available server-side');
    }

    this.dimension = dimension;

    this.messenger.emit('setPlayerDimension', [this.id, dimension]);
  }

  setPosition(position: Vector3 | Vector3Array, instant = true) {
    // Vector3Array
    if (Array.isArray(position)) {
      this.location.position.set(...position);
    } else {
      // Vector3
      this.location.position.copy(position);
    }

    // emit
    this.messenger.emit('setPlayerPosition', [
      this.id,
      this.location.position.toArray(),
      instant,
    ]);
  }

  setRotation(
    rotation: Quaternion | Euler | QuaternionArray | Vector3Array,
    instant = true,
  ) {
    if (Array.isArray(rotation)) {
      // Vector3Array
      if (rotation.length === 3) {
        this.location.rotation.set(...rotation);
      } else {
        // QuaternionArray
        this.location.quaternion.set(...rotation);
      }
    } else {
      // Euler
      if (rotation instanceof Euler) {
        this.location.rotation.copy(rotation);
      } else {
        // Quaternion
        this.location.quaternion.copy(rotation);
      }
    }

    // emit
    this.messenger.emit('setPlayerRotation', [
      this.id,
      this.location.quaternion.toArray() as QuaternionArray,
      instant,
    ]);
  }

  getFacingAngle() {
    return radToDeg(this.location.rotation.y);
  }

  setFacingAngle(degrees: number, instant = true) {
    // update
    this.location.rotation.y = degToRad(degrees);

    // emit
    this.messenger.emit('setPlayerFacingAngle', [this.id, degrees, instant]);
  }

  setCameraBehind() {
    this.messenger.emit('setPlayerCameraBehind', [this.id]);
  }

  sendMessage(message: string) {
    this.engine.chat.sendMessageTo(this.id, message);
  }

  setMovements(status: boolean) {
    this.messenger.emit('setPlayerMovements', [this.id, status]);
  }

  setTranslations(x: boolean, y: boolean, z: boolean) {
    this.messenger.emit('setPlayerTranslations', [this.id, x, y, z]);
  }

  setLinearVelocity(vec: Vector3 | Vector3Array) {
    this.messenger.emit('setPlayerLinearVelocity', [
      this.id,
      Array.isArray(vec) ? vec : vec.toArray(),
    ]);
  }

  setVisible(visible: boolean) {
    this.messenger.emit('setPlayerVisible', [this.id, visible]);
  }

  sendSuccessNotification(message: string, duration = 0) {
    this.messenger.emit('sendPlayerNotification', [
      this.id,
      message,
      'success',
      duration,
    ]);
  }

  sendErrorNotification(message: string, duration = 0) {
    this.messenger.emit('sendPlayerNotification', [
      this.id,
      message,
      'error',
      duration,
    ]);
  }
}

export default PlayerManager;
