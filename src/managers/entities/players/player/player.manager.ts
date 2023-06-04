import {Euler, Quaternion, Vector3} from 'three';
import {MathUtils} from 'three';

import {STREAMER_CHUNK_SIZE} from 'engine/definitions/constants/streamer.constants';
import {
  AnimationEvent,
  AnimationOptions,
} from 'engine/definitions/types/animations.types';
import {ChunkIndex} from 'engine/definitions/types/chunks.types';
import {PlayerClotheItem} from 'engine/definitions/types/clothes.types';
import {PlayerControls} from 'engine/definitions/types/controls.types';
import {PlayerEntity} from 'engine/definitions/types/entities.types';
import {PlayerEventMap} from 'engine/definitions/types/events.types';
import {ColorType} from 'engine/definitions/types/ui.types';
import {
  QuaternionArray,
  Vector3Array,
} from 'engine/definitions/types/world.types';
import {
  PlayerPacketDto,
  PlayerPacketUpdateDto,
} from 'engine/generated/dtos.types';
import EngineManager from 'engine/managers/engine.manager';
import MessengerEmitterManager from 'engine/managers/messenger/messenger-emitter.manager';
import {getChunkInfo} from 'engine/utils/chunks.utils';

import EntityManager from '../../entity/entity.manager';
import PlayerCameraManager from './player-camera.manager';
import type PlayerHandleManager from './player-handle.manager';
import PlayerVoicechatManager from './player-voicechat.manager';

class PlayerManager extends EntityManager<
  PlayerEntity,
  PlayerHandleManager,
  PlayerEventMap
> {
  chunksIn = new Set<ChunkIndex>();

  messenger: MessengerEmitterManager;

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

  get isAdmin() {
    return this.engine.network.hasAdminRole(this.roles);
  }

  get isController() {
    return !!this.data?.controller;
  }

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

  get velocity() {
    return this.handle.velocity;
  }

  private get _serverCommands() {
    return this.engine.network.serverCommands;
  }

  constructor(entity: PlayerEntity, engine: EngineManager) {
    super(entity, engine);

    this.voicechat = new PlayerVoicechatManager(this);

    this.messenger = new MessengerEmitterManager(engine);

    this.messenger.playerId = this.id;

    if (engine.isServer || this.isController) {
      this.camera = new PlayerCameraManager(this);
    }

    this.updateChunkIndex();
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
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

  setNametagColor(color: ColorType) {
    this.messenger.emit('setPlayerNametagColor', [this.id, color]);
  }

  async addRole(roleId: string) {
    await this.messenger.emitAsync('addPlayerRole', [this.id, roleId]);
  }

  async removeRole(roleId: string) {
    await this.messenger.emitAsync('removePlayerRole', [this.id, roleId]);
  }

  async getBanStatus() {
    const {
      data: [status],
    } = await this.messenger.emitAsync('getPlayerBanStatus', [this.id]);

    return status;
  }

  async ban(reason: string, duration = null) {
    const {
      data: [status],
    } = await this.messenger.emitAsync('banPlayer', [
      this.id,
      reason,
      duration,
    ]);

    return status;
  }

  async unban() {
    await this.messenger.emitAsync('unbanPlayer', [this.id]);
  }

  async kick(reason: string) {
    await this.messenger.emitAsync('kickPlayer', [this.id, reason]);
  }

  setDimension(dimension: number) {
    if (!this.engine.api.isServer) {
      throw new Error('player.setDimension is only available server-side');
    }

    this.dimension = dimension;

    this.messenger.emit('setPlayerDimension', [this.id, dimension]);

    this.updateChunkIndex();
  }

  setPosition(position: Vector3 | Vector3Array, instant = true) {
    this.updatePosition(position);

    // emit
    this.messenger.emit('setPlayerPosition', [
      this.id,
      this.location.position.toArray(),
      instant,
    ]);

    this.updateChunkIndex();
  }

  setRotation(
    rotation: Quaternion | Euler | QuaternionArray | Vector3Array,
    instant = true,
  ) {
    this.updateRotation(rotation);

    // emit
    this.messenger.emit('setPlayerRotation', [
      this.id,
      this.location.quaternion.toArray() as QuaternionArray,
      instant,
    ]);
  }

  getFacingAngle() {
    return MathUtils.radToDeg(this.location.rotation.y);
  }

  setFacingAngle(degrees: number, instant = true) {
    // update
    this.location.rotation.y = MathUtils.degToRad(degrees);

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

  updateChunkIndex() {
    // ignore client-side
    if (this.engine.isClient) return;

    super.updateChunkIndex();

    // update chunks if chunk changed
    if (this._lastChunk !== this.chunkIndex) {
      this._calculateChunks();
    }
  }

  private _lastChunk: ChunkIndex = null!;

  private async _calculateChunks() {
    // this function will calculate 27 chunks
    // in the X, Y and Z axes

    this._lastChunk = this.chunkIndex;

    const chunk = getChunkInfo(
      this.position.x,
      this.position.y,
      this.position.z,
      this.dimension,

      STREAMER_CHUNK_SIZE,
    );

    const distance = 1;

    // prepare params
    const end = Math.ceil(distance / 2);
    const start = end * -1;

    this.chunksIn.clear();

    // y is always 0 for `entities` mode
    const yStart = start;
    const yEnd = end;

    let x = 0;
    let y = 0;
    let z = 0;

    for (z = start; z <= end; z++) {
      for (x = start; x <= end; x++) {
        for (y = yStart; y <= yEnd; y++) {
          this.chunksIn.add(
            `${chunk.x + x}_${chunk.y + y}_${chunk.z + z}_${chunk.dimension}`,
          );
        }
      }
    }
  }

  addClothes(
    clotheItems: PlayerClotheItem | PlayerClotheItem[],
    replace = false,
  ) {
    this.messenger.emit('addPlayerClothes', [
      this.id,
      Array.isArray(clotheItems) ? clotheItems : [clotheItems],
      replace,
    ]);
  }

  removeClothes(clotheIds: string | string[]) {
    this.messenger.emit('removePlayerClothes', [
      this.id,
      Array.isArray(clotheIds) ? clotheIds : [clotheIds],
    ]);
  }

  async getClothes() {
    const {
      data: [clothes],
    } = await this.messenger.emitAsync('getPlayerClothes', [this.id]);

    return clothes;
  }

  playAnimation(animId: string, options: AnimationOptions) {
    this.messenger.emit('playPlayerAnimation', [this.id, animId, options]);
  }

  stopAnimation(animId: string, fadeOutDuration = 0) {
    this.messenger.emit('stopPlayerAnimation', [
      this.id,
      animId,
      fadeOutDuration,
    ]);
  }

  stopAnimations(fadeOutDuration = 0) {
    this.messenger.emit('stopPlayerAnimations', [this.id, fadeOutDuration]);
  }

  pauseAnimation(animId: string) {
    this.messenger.emit('pausePlayerAnimation', [this.id, animId]);
  }

  resumeAnimation(animId: string) {
    this.messenger.emit('resumePlayerAnimation', [this.id, animId]);
  }

  _onAnimation = (event: AnimationEvent) => {
    this.events.emit('onAnimation', event);
  };

  _onUpdate = (packet: PlayerPacketDto | PlayerPacketUpdateDto) => {
    this.engine.players.handlePacket(this.id, packet as PlayerPacketDto);
  };

  _onEnterSensor = async (objectId: string) => {
    const object = await this.engine.objects.resolve(objectId);

    if (object) {
      this.events.emit('onEnterSensor', object);
    }
  };

  _onLeaveSensor = async (objectId: string) => {
    const object = await this.engine.objects.resolve(objectId);

    if (object) {
      this.events.emit('onLeaveSensor', object);
    }
  };
}

export default PlayerManager;
