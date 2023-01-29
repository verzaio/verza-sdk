import EntityHandleManager from '../../entity/entity-handle.manager';
import ObjectManager from './object.manager';

class ObjectHandleManager extends EntityHandleManager<ObjectManager> {
  constructor(object: ObjectManager) {
    super(object);
  }
}

export default ObjectHandleManager;
