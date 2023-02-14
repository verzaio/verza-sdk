import {Euler, Quaternion, Vector3} from 'three';

import {degToRad, radToDeg} from 'three/src/math/MathUtils';

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
  private _messenger: PlayerMessengerManager = null!;

  get messenger() {
    return this._messenger ?? this.engine.messenger;
  }

  voicechat: PlayerVoicechatManager;

  camera: PlayerCameraManager = null!;

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
      this._messenger = new PlayerMessengerManager(this);
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
    this._messenger.emit('setPlayerName', [this.id, name]);
  }

  addRole(roleId: string) {
    this._messenger.emit('addPlayerRole', [this.id, roleId]);
  }

  removeRole(roleId: string) {
    this._messenger.emit('removePlayerRole', [this.id, roleId]);
  }

  setDimension(dimension: number) {
    if (!this.engine.api.isServer) {
      throw new Error('player.setDimension is only available server-side');
    }

    this.dimension = dimension;

    this._messenger.emit('setPlayerDimension', [this.id, dimension]);
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
    this._messenger.emit('setPlayerPosition', [
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
    this._messenger.emit('setPlayerRotation', [
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
    this._messenger.emit('setPlayerFacingAngle', [this.id, degrees, instant]);
  }

  setCameraBehind() {
    this._messenger.emit('setPlayerCameraBehind', [this.id]);
  }

  sendMessage(message: string) {
    this.engine.chat.sendMessageTo(this.id, message);
  }
}

export default PlayerManager;
