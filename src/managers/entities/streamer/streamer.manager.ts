import {ChunkData, ChunkIndex} from 'engine/definitions/types/chunks.types';
import EngineManager from 'engine/managers/engine.manager';

import ObjectManager from '../objects/object/object.manager';

type StreamerEntity = ObjectManager;

class StreamerManager {
  private _engine: EngineManager;

  private _entitiesRel = new Map<StreamerEntity, ChunkIndex>();

  private _chunks = new Map<ChunkIndex, Set<StreamerEntity>>();

  private get _api() {
    return this._engine.api;
  }
  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  refreshEntity(entity: StreamerEntity) {
    if (!entity.chunkIndex) return;

    const chunkIndex = this._entitiesRel.get(entity);

    if (chunkIndex === entity.chunkIndex) return;

    if (chunkIndex) {
      this._chunks.get(chunkIndex)?.delete(entity);
    } else {
      // if new, then sync it
      this.syncEntity(entity);
    }

    this._entitiesRel.set(entity, entity.chunkIndex);

    const entities = this._chunks.get(entity.chunkIndex);

    if (entities) {
      entities.add(entity);
    } else {
      this._chunks.set(entity.chunkIndex, new Set<StreamerEntity>([entity]));
    }
  }

  removeEntity(entity: StreamerEntity) {
    const chunkIndex = this._entitiesRel.get(entity);

    if (!chunkIndex) return;

    this._entitiesRel.delete(entity);
    this._chunks.get(chunkIndex)?.delete(entity);
  }

  syncEntity(entity: StreamerEntity) {
    switch (entity.type) {
      case 'object': {
        this.syncEntities(entity.chunkIndex, {
          o: [
            {
              [entity.objectType]: entity.toData(),
            },
          ],
        });
        break;
      }
    }
  }

  syncEntities(chunkIndex: ChunkIndex, data: ChunkData) {
    this._engine.players.forEachInChunk(chunkIndex, player => {
      console.log('sending to playerid', player.id);
      this._api.emitAction('sendChunk', [chunkIndex, data], player.id);
    });
  }

  bind() {
    // remove objects
    this._engine.objects.events.on('onDestroy', object => {
      this.removeEntity(object);
    });

    // sync objects
    this._engine.objects.events.on('onChunkIndexChange', object => {
      console.log('onChunkIndexChange', object.id);

      this.refreshEntity(object);

      this.syncEntity(object);
    });
  }

  handleChunk(playerId: number, chunkIndex: ChunkIndex) {
    // TODO: Implement

    playerId;
    chunkIndex;

    //this._api.emitAction('sendChunk', [chunkIndex, data], player.id);
    //console.log('handleChunk', playerId, chunkIndex);
  }
}

export default StreamerManager;
