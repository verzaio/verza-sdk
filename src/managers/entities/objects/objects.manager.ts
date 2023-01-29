import {EntityType} from 'engine/definitions/enums/entities.enums';

import EngineManager from '../../engine.manager';
import EntitiesManager from '../entities.manager';
import ObjectManager from './object/object.manager';

class ObjectsManager extends EntitiesManager<ObjectManager> {
  constructor(engine: EngineManager) {
    super(EntityType.object, engine);
  }
}

export default ObjectsManager;
