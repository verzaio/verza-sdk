import {ChunkIndex} from 'engine/definitions/types/chunks.types';
import EngineManager from 'engine/managers/engine.manager';

import ObjectManager from '../objects/object/object.manager';

type StreamerEntity = ObjectManager;

class StreamerManager {
  private _engine: EngineManager;

  private _entities = new Set<StreamerEntity>();

  private _entitiesMap = new Map<ChunkIndex, StreamerEntity>();

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  bind() {
    /* this._engine.objects.events.on('onCreate', object => {
      console.log('onChunkIndexChange', object.id);
    });
 */
    this._engine.objects.events.on('onChunkIndexChange', object => {
      console.log('onChunkIndexChange', object.id);
    });
  }

  handleChunk(playerId: number, chunkIndex: ChunkIndex) {
    // TODO: Implement

    playerId;
    chunkIndex;

    //console.log('handleChunk', playerId, chunkIndex);
  }
}

export default StreamerManager;
