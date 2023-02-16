import EntityHandleManager from '../../entity/entity-handle.manager';
import ObjectManager from './object.manager';
declare class ObjectHandleManager extends EntityHandleManager<ObjectManager> {
    constructor(object: ObjectManager);
}
export default ObjectHandleManager;
