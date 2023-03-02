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
      this.syncEntity(entity, chunkIndex);
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

  syncEntity(entity: StreamerEntity, prevChunkIndex?: ChunkIndex) {
    switch (entity.type) {
      case 'object': {
        this.syncEntities(
          {
            o: [
              {
                [entity.objectType]: entity.toData(),
              },
            ],
          },
          entity.chunkIndex,
          prevChunkIndex,
        );
        break;
      }
    }
  }

  syncEntities(
    data: ChunkData,
    chunkIndex: ChunkIndex,
    prevChunkIndex?: ChunkIndex,
  ) {
    this._engine.players.entitiesMap.forEach(player => {
      if (player.chunksIn.has(chunkIndex)) {
        this._api.emitAction('sendChunk', [chunkIndex, data], player.id);
      } else if (prevChunkIndex && player.chunksIn.has(prevChunkIndex)) {
        this._api.emitAction('sendChunk', [prevChunkIndex, data], player.id);
      }
    });
  }

  bind() {
    // remove objects
    this._engine.objects.events.on('onDestroy', object => {
      this.removeEntity(object);
    });

    // sync objects
    this._engine.objects.events.on('onChunkIndexChange', object => {
      this.refreshEntity(object);
    });
  }

  handleChunk(playerId: number, chunkIndex: ChunkIndex) {
    // TODO: Implement

    playerId;
    chunkIndex;

    const chunk: ChunkData = {
      o: [],
    };

    this._chunks.get(chunkIndex)?.forEach(object => {
      chunk.o?.push({
        [object.objectType]: object.toData(),
      });
    });

    if (!chunk.o?.length) return;

    this._api.emitAction('sendChunk', [chunkIndex, chunk], playerId);
  }
}

export default StreamerManager;
