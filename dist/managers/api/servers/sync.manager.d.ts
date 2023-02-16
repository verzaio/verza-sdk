import { NetworkSyncEventMap } from '../../../definitions/enums/networks.enums';
import EngineManager from '../../../managers/engine.manager';
import EventsManager from '../../../managers/events.manager';
type SyncEventMap = {
    [key in keyof NetworkSyncEventMap]: (...data: NetworkSyncEventMap[key]) => void;
};
declare class SyncManager {
    private _engine;
    events: EventsManager<SyncEventMap>;
    get players(): import("../../entities/players/players.manager").default;
    constructor(engine: EngineManager);
    private _bind;
}
export default SyncManager;
