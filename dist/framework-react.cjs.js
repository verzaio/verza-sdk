'use strict';

var React = require('react');
var zod = require('zod');
var three = require('three');
var uuid = require('uuid');
var events = require('events');
var tweetnacl = require('tweetnacl');
var tweetnaclUtil = require('tweetnacl-util');
var socket_ioClient = require('socket.io-client');
var msgpackParser = require('socket.io-msgpack-parser');

class EntityHandleManager {
    get id() {
        return this.manager.id;
    }
    get events() {
        return this.manager.events;
    }
    constructor(manager) {
        this.manager = manager;
        manager.handle = this;
    }
}

class ObjectHandleManager extends EntityHandleManager {
    constructor(object) {
        super(object);
    }
}

const DEFAULT_ENTITY_DRAW_DISTANCE = 'low';

class EntityManager {
    get id() {
        return this.entity.id;
    }
    get type() {
        return this.entity.type;
    }
    get data() {
        return this.entity.data;
    }
    get location() {
        return this._location;
    }
    get position() {
        return this._location.position;
    }
    get rotation() {
        return this._location.quaternion;
    }
    constructor(entity, engine) {
        this.destroyed = false;
        this.handle = null;
        this.streamed = false;
        this.events = null;
        this._location = new three.Object3D();
        this.streamer = null;
        this.dimension = 0;
        this.drawDistance = DEFAULT_ENTITY_DRAW_DISTANCE;
        this.entity = entity;
        this.engine = engine;
    }
    restoreData() {
        var _a, _b, _c;
        if (this.data.dimension !== undefined) {
            this.dimension = this.data.dimension;
        }
        if ((_b = (_a = this.data) === null || _a === void 0 ? void 0 : _a.m) === null || _b === void 0 ? void 0 : _b.d) {
            this.drawDistance = this.data.m.d;
        }
        if ((_c = this.data.p) === null || _c === void 0 ? void 0 : _c.p) {
            this.location.position.set(this.data.p.p[0], this.data.p.p[1], this.data.p.p[2]);
            if (this.data.p.p[7] !== undefined) {
                this.location.quaternion.set(this.data.p.p[4], this.data.p.p[5], this.data.p.p[6], this.data.p.p[7]);
            }
            else {
                if (this.data.p.p[4] !== undefined) {
                    this.location.rotation.set(this.data.p.p[4], this.data.p.p[5], this.data.p.p[6]);
                }
            }
        }
        if (this.data.position) {
            this.location.position.set(...this.data.position);
        }
        if (this.data.rotation) {
            if (this.data.rotation.length === 4) {
                this.location.quaternion.set(...this.data.rotation);
            }
            else {
                this.location.rotation.set(...this.data.rotation);
            }
        }
    }
}

class ObjectManager extends EntityManager {
    get objectType() {
        return this.data.t;
    }
    get location() {
        return super.location;
    }
    get position() {
        return super.location.position;
    }
    get rotation() {
        return super.location.quaternion;
    }
    get _messenger() {
        return this.engine.messenger;
    }
    get _parentId() {
        return this.data.parent_id;
    }
    constructor(entity, engine) {
        super(entity, engine);
        this.parent = null;
        this.children = new Set();
        this.restoreData();
        this._checkForChildren();
        if (this._parentId) {
            this._attachToParent(this.engine.objects.get(this._parentId));
            if (this.parent) {
                return;
            }
        }
    }
    setPosition(position) {
        if (Array.isArray(position)) {
            this.location.position.set(...position);
        }
        else {
            this.location.position.copy(position);
        }
        this._messenger.emit('setObjectPosition', [
            this.id,
            this.location.position.toArray(),
        ]);
    }
    setRotation(rotation) {
        if (Array.isArray(rotation)) {
            if (rotation.length === 3) {
                this.location.rotation.set(...rotation);
            }
            else {
                this.location.quaternion.set(...rotation);
            }
        }
        else {
            if (rotation instanceof three.Euler) {
                this.location.rotation.copy(rotation);
            }
            else {
                this.location.quaternion.copy(rotation);
            }
        }
        this._messenger.emit('setObjectRotation', [
            this.id,
            this.location.quaternion.toArray(),
        ]);
    }
    detachFromParent() {
        if (!this.parent)
            return;
        this.parent.children.delete(this);
        this.parent = null;
    }
    _attachToParent(parent) {
        if (!parent) {
            console.debug(`[objects:script] no parent found (parent id: ${this._parentId} | object id: ${this.id}:${this.objectType})`);
            return;
        }
        if (parent.objectType !== 'group') {
            console.debug(`[objects:script] only groups can have children (parent id: ${this._parentId}:${parent === null || parent === void 0 ? void 0 : parent.objectType} | object id ${this.id}:${this.objectType})`);
            return;
        }
        this.parent = parent;
        parent.children.add(this);
    }
    _checkForChildren() {
        var _a, _b, _c;
        if (this.objectType !== 'group')
            return;
        (_c = (_b = (_a = this.data.m) === null || _a === void 0 ? void 0 : _a.group) === null || _b === void 0 ? void 0 : _b.c) === null || _c === void 0 ? void 0 : _c.forEach(item => {
            var _a;
            const data = (_a = item.m) === null || _a === void 0 ? void 0 : _a[item.t];
            if (data) {
                item.parent_id = this.id;
                this.engine.objects.create(item.t, item);
            }
        });
    }
}

var EntityType;
(function (EntityType) {
    EntityType["player"] = "player";
    EntityType["object"] = "object";
})(EntityType || (EntityType = {}));
var EntityDrawDistance;
(function (EntityDrawDistance) {
    EntityDrawDistance["low"] = "low";
    EntityDrawDistance["mid"] = "mid";
    EntityDrawDistance["high"] = "high";
})(EntityDrawDistance || (EntityDrawDistance = {}));

class EventsManager {
    constructor() {
        this._eventEmitter = new events.EventEmitter();
        this._eventEmitter.setMaxListeners(Infinity);
    }
    getEmitter() {
        return this._eventEmitter;
    }
    on(eventName, listener) {
        this._eventEmitter.on(eventName, listener);
        return listener;
    }
    off(eventName, listener) {
        this._eventEmitter.off(eventName, listener);
    }
    once(eventName, listener) {
        this._eventEmitter.once(eventName, listener);
        return listener;
    }
    listenerCount(eventName) {
        return this._eventEmitter.listenerCount(eventName);
    }
    emit(eventName, ...args) {
        try {
            return this._eventEmitter.emit(eventName, ...args);
        }
        catch (e) {
            console.error(e);
        }
        return false;
    }
    removeAllListeners() {
        this._eventEmitter.removeAllListeners();
    }
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class EntityStreamManager {
    constructor(entity) {
        this.streamedPlayers = new Set();
        this.entity = entity;
    }
    sync(player, action) {
        return __awaiter(this, void 0, void 0, function* () {
            console.debug(`syncing ${player.id} ${action}`);
            if (action) {
                if (this.streamedPlayers.has(player))
                    return;
                this.streamedPlayers.add(player);
                if (this.entity.type === 'player') {
                    player.streamer.streamedPlayers.add(this.entity);
                }
                return;
            }
            if (!this.streamedPlayers.has(player))
                return;
            this.streamedPlayers.delete(player);
            if (this.entity.type === 'player') {
                player.streamer.streamedPlayers.delete(this.entity);
            }
        });
    }
}

class EntitiesManager {
    constructor(type, engine) {
        var _a;
        this.entities = [];
        this.entitiesMap = new Map();
        this.streamed = new Map();
        this.Handler = null;
        this.Manager = null;
        this.useStreamer = false;
        this.type = type;
        this.engine = engine;
        this.events =
            (_a = this.engine.eventsManager.get(this.type)) !== null && _a !== void 0 ? _a : new EventsManager();
        this.engine.eventsManager.set(this.type, this.events);
    }
    is(id) {
        return this.entitiesMap.has(id);
    }
    get(id) {
        return this.entitiesMap.get(id);
    }
    create(id, data) {
        var _a;
        let entity = null;
        entity = this.get(id);
        if (entity) {
            console.warn(`entity (${this.type}) already created id:${id}`);
            return entity;
        }
        const newEntity = {
            id,
            type: this.type,
            data: data !== null && data !== void 0 ? data : {},
        };
        entity = new this.Manager(newEntity, this.engine);
        entity.events =
            (_a = this.engine.eventsManager.get(`${entity.type}.${entity.id}`)) !== null && _a !== void 0 ? _a : new EventsManager();
        this.engine.eventsManager.set(`${entity.type}.${entity.id}`, entity.events);
        if (this.useStreamer) {
            entity.streamer = new EntityStreamManager(entity);
        }
        this.entitiesMap.set(id, entity);
        this.entities.push(entity);
        this.events.emit('onConnect', entity);
        return entity;
    }
    destroy(entity) {
        if (!this.is(entity === null || entity === void 0 ? void 0 : entity.id)) {
            return;
        }
        entity.destroyed = true;
        if (this.events) {
            entity.events.removeAllListeners();
            this.engine.eventsManager.delete(`${entity.type}.${entity.id}`);
        }
        this.entitiesMap.delete(entity.id);
        this.entities.splice(this.entities.indexOf(entity), 1);
        this.events.emit('onDisconnect', entity);
    }
    streamIn(entity, data) {
        if (entity === null || entity === void 0 ? void 0 : entity.handle) {
            return;
        }
        if (data) {
            Object.assign(entity.data, data);
        }
        entity.handle = new this.Handler(entity);
        entity.streamed = true;
        this.streamed.set(entity.id, entity);
        this.events.emit('onStreamIn', entity);
        entity.events.emit('onStreamIn', entity);
    }
    streamOut(entity) {
        if (!(entity === null || entity === void 0 ? void 0 : entity.handle))
            return;
        entity.handle = null;
        entity.streamed = false;
        this.streamed.delete(entity.id);
        this.events.emit('onStreamOut', entity);
        entity.events.emit('onStreamOut', entity);
    }
    get map() {
        return this.entities.map;
    }
    get some() {
        return this.entities.some;
    }
    get filter() {
        return this.entities.filter;
    }
    get find() {
        return this.entities.find;
    }
    get forEach() {
        return this.entitiesMap.forEach;
    }
}

class ObjectsManager extends EntitiesManager {
    get _messenger() {
        return this.engine.messenger;
    }
    constructor(engine) {
        super(EntityType.object, engine);
        this._binded = false;
    }
    _load() {
        if (this._binded)
            return;
        this._messenger.events.on('destroyObject', ({ data: [objectId] }) => {
            this.destroy(this.get(objectId), false);
        });
        this._binded = true;
    }
    unload() {
        this._binded = false;
    }
    _createObject(type, props) {
        this._load();
        if (!props.id) {
            props.id = uuid.v4();
        }
        if (props.position) {
            props.position = Array.isArray(props.position)
                ? props.position
                : props.position.toArray();
        }
        if (props.rotation) {
            props.rotation = Array.isArray(props.rotation)
                ? props.rotation
                : props.rotation.toArray();
        }
        const { id, parentId, position, rotation, drawDistance, collision, scale, shadows, } = props;
        const objectData = {
            id,
            parent_id: parentId,
            t: type,
            drawDistance: drawDistance !== null && drawDistance !== void 0 ? drawDistance : 'high',
            position,
            rotation,
            m: {
                p: collision,
                s: scale,
                ss: shadows,
                [type]: props.data,
            },
        };
        const object = this.create(props.id, objectData);
        this._messenger.emit('createObject', [type, props]);
        return object;
    }
    createGroup(children, props = {}) {
        return this._createObject('group', Object.assign({ group: {
                c: children !== null && children !== void 0 ? children : [],
            } }, props));
    }
    createModel(model, props = {}) {
        return this._createObject('model', Object.assign({ model: {
                m: model,
            } }, props));
    }
    createBox(box, props = {}) {
        return this._createObject('box', Object.assign({ box }, props));
    }
    createLine(points, color, props = {}) {
        return this._createObject('line', Object.assign({ line: {
                p: points.map(p => ({ p })),
                c: color,
            } }, props));
    }
    createGltf(url, props = {}) {
        return this._createObject('gltf', Object.assign({ gltf: {
                u: url,
            } }, props));
    }
    destroy(entity, report = true) {
        if (!this.is(entity === null || entity === void 0 ? void 0 : entity.id)) {
            return;
        }
        entity.detachFromParent();
        entity.children.forEach(entity => {
            this.destroy(entity);
        });
        super.destroy(entity);
        if (report) {
            this._messenger.emit('destroyObject', [entity.id]);
        }
    }
}

const ANIMATIONS = {
    none: 0,
    idle_male: 10,
    idle_female: 11,
    idle_neutral_1: 12,
    idle_neutral_2: 13,
    dead: 20,
    walking_style_1: 30,
    walking_style_2: 31,
    walking_style_3: 32,
    walking_style_4: 33,
    running: 40,
    jumping_long: 50,
    falling: 60,
    rolling: 61,
};
const ANIMATIONS_INDEX = Object.entries(ANIMATIONS).reduce((anims, anim) => {
    anims[anim[1]] = anim[0];
    return anims;
}, {});

class PlayerAnimationsManager {
    get stateAnim() {
        var _a;
        return (_a = ANIMATIONS_INDEX[this.stateAnimIndex]) !== null && _a !== void 0 ? _a : null;
    }
    constructor(player, initAnim) {
        this.stateAnimIndex = 0;
        this._player = player;
        this.stateAnimIndex = initAnim !== null && initAnim !== void 0 ? initAnim : ANIMATIONS.none;
    }
}

class PlayerHandleManager extends EntityHandleManager {
    get _player() {
        return this.manager;
    }
    constructor(player) {
        super(player);
        this.state = 'idle';
        this.velocity = new three.Vector3();
        this.onGround = false;
        this.animations = new PlayerAnimationsManager(this._player);
    }
}

class PlayerCameraManager {
    get _messenger() {
        return this._player.messenger;
    }
    constructor(player) {
        this._player = player;
    }
    _normalizePosition(transition) {
        if (transition.to instanceof three.Vector3) {
            transition.to = transition.to.toArray();
        }
        if (transition.from instanceof three.Vector3) {
            transition.from = transition.from.toArray();
        }
        if (transition.lookAt instanceof three.Vector3) {
            transition.lookAt = transition.lookAt.toArray();
        }
    }
    setMode(mode, instant = true) {
        this._messenger.emit('onCameraModeChange', [
            this._player.id,
            mode,
            instant,
        ]);
    }
    setTransitions(transitions) {
        transitions.forEach(transition => {
            this._normalizePosition(transition);
        });
        this._messenger.emit('setCameraTransitions', [
            this._player.id,
            transitions,
        ]);
    }
    setTransition(transition) {
        this._normalizePosition(transition);
        this._messenger.emit('setCameraTransition', [this._player.id, transition]);
    }
    setPosition(transition) {
        this._normalizePosition(transition);
        this._messenger.emit('setCameraPosition', [this._player.id, transition]);
    }
}

class PlayerMessengerManager {
    constructor(player) {
        this._player = player;
    }
    emit(eventName, args) {
        return __awaiter(this, void 0, void 0, function* () {
            this._player.engine.api.emitAction(eventName, args);
        });
    }
}

class PlayerVoicechatManager {
    constructor(player) {
        this.connectedPlayers = new Set();
        this._player = player;
    }
    isConnected(player) {
        return this.connectedPlayers.has(player);
    }
    addPlayer(player) {
        this.connectedPlayers.add(player);
    }
    removePlayer(player) {
        this.connectedPlayers.add(player);
    }
    connect(player) {
        this.addPlayer(player);
        player.voicechat.addPlayer(this._player);
    }
    disconnect(player) {
        this.removePlayer(player);
        player.voicechat.removePlayer(this._player);
    }
}

class PlayerManager extends EntityManager {
    get messenger() {
        var _a;
        return (_a = this._local_messenger) !== null && _a !== void 0 ? _a : this.engine.messenger;
    }
    get isMovingControl() {
        return (this.controls.forward ||
            this.controls.backward ||
            this.controls.left ||
            this.controls.right);
    }
    get name() {
        var _a;
        return (_a = this.data.name) !== null && _a !== void 0 ? _a : `Player ${this.id}`;
    }
    get roles() {
        var _a;
        return (_a = this.data.roles) !== null && _a !== void 0 ? _a : [];
    }
    set roles(roles) {
        this.data.roles = roles;
    }
    get onGround() {
        var _a;
        return (_a = this.handle) === null || _a === void 0 ? void 0 : _a.onGround;
    }
    get state() {
        var _a;
        return (_a = this.handle) === null || _a === void 0 ? void 0 : _a.state;
    }
    get isControlling() {
        var _a;
        return !!((_a = this.data) === null || _a === void 0 ? void 0 : _a.controls);
    }
    get velocity() {
        return this.handle.velocity;
    }
    get _serverCommands() {
        return this.engine.network.serverCommands;
    }
    constructor(entity, engine) {
        super(entity, engine);
        this._local_messenger = null;
        this.camera = null;
        this.controls = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false,
            sprint: false,
            caps: false,
            alt: false,
            control: false,
        };
        this.voicechat = new PlayerVoicechatManager(this);
        if (engine.isServer) {
            this._local_messenger = new PlayerMessengerManager(this);
        }
        if (engine.isServer || this.isControlling) {
            this.camera = new PlayerCameraManager(this);
        }
    }
    hasAccess(command) {
        var _a;
        if (this.engine.api.isWebServer) {
            throw new Error('player.hasAccess is not available on WebServer');
        }
        const roles = (_a = this._serverCommands.get(command)) === null || _a === void 0 ? void 0 : _a.roles;
        if (!(roles === null || roles === void 0 ? void 0 : roles.length))
            return true;
        return this.roles.some(e => roles.includes(e));
    }
    updateName(name) {
        this.data.name = name;
    }
    updateRoles(roles) {
        this.data.roles = roles;
    }
    setName(name) {
        this.messenger.emit('setPlayerName', [this.id, name]);
    }
    addRole(roleId) {
        this.messenger.emit('addPlayerRole', [this.id, roleId]);
    }
    removeRole(roleId) {
        this.messenger.emit('removePlayerRole', [this.id, roleId]);
    }
    setDimension(dimension) {
        if (!this.engine.api.isServer) {
            throw new Error('player.setDimension is only available server-side');
        }
        this.dimension = dimension;
        this.messenger.emit('setPlayerDimension', [this.id, dimension]);
    }
    setPosition(position, instant = true) {
        if (Array.isArray(position)) {
            this.location.position.set(...position);
        }
        else {
            this.location.position.copy(position);
        }
        this.messenger.emit('setPlayerPosition', [
            this.id,
            this.location.position.toArray(),
            instant,
        ]);
    }
    setRotation(rotation, instant = true) {
        if (Array.isArray(rotation)) {
            if (rotation.length === 3) {
                this.location.rotation.set(...rotation);
            }
            else {
                this.location.quaternion.set(...rotation);
            }
        }
        else {
            if (rotation instanceof three.Euler) {
                this.location.rotation.copy(rotation);
            }
            else {
                this.location.quaternion.copy(rotation);
            }
        }
        this.messenger.emit('setPlayerRotation', [
            this.id,
            this.location.quaternion.toArray(),
            instant,
        ]);
    }
    getFacingAngle() {
        return three.MathUtils.radToDeg(this.location.rotation.y);
    }
    setFacingAngle(degrees, instant = true) {
        this.location.rotation.y = three.MathUtils.degToRad(degrees);
        this.messenger.emit('setPlayerFacingAngle', [this.id, degrees, instant]);
    }
    setCameraBehind() {
        this.messenger.emit('setPlayerCameraBehind', [this.id]);
    }
    sendMessage(message) {
        this.engine.chat.sendMessageTo(this.id, message);
    }
    setMovements(status) {
        this.messenger.emit('setPlayerMovements', [this.id, status]);
    }
    setTranslations(x, y, z) {
        this.messenger.emit('setPlayerTranslations', [this.id, x, y, z]);
    }
    setLinearVelocity(vec) {
        this.messenger.emit('setPlayerLinearVelocity', [
            this.id,
            Array.isArray(vec) ? vec : vec.toArray(),
        ]);
    }
    setVisible(visible) {
        this.messenger.emit('setPlayerVisible', [this.id, visible]);
    }
    sendSuccessNotification(message, duration = 0) {
        this.messenger.emit('sendPlayerNotification', [
            this.id,
            message,
            'success',
            duration,
        ]);
    }
    sendErrorNotification(message, duration = 0) {
        this.messenger.emit('sendPlayerNotification', [
            this.id,
            message,
            'error',
            duration,
        ]);
    }
}

const PLAYER_STATE_PACKET = {
    idle: 0,
    dead: 1,
    walking: 2,
    running: 3,
    jumping: 4,
    falling: 5,
};
const PLAYER_STATE_PACKET_INDEX = Object.entries(PLAYER_STATE_PACKET).reduce((anims, anim) => {
    anims[anim[1]] = anim[0];
    return anims;
}, {});

class PlayersManager extends EntitiesManager {
    get _messenger() {
        return this.engine.messenger;
    }
    constructor(engine) {
        super(EntityType.player, engine);
        this._binded = false;
    }
    load() {
        if (this._binded)
            return;
        this._binded = true;
        if (this.engine.isClient) {
            if (this.engine.syncPlayerUpdates ||
                this.engine.syncPlayerUpdatesPriority) {
                this._messenger.events.on('onPlayerUpdate', ({ data: [playerId, packet] }) => {
                    this.handlePacket(playerId, packet);
                });
            }
            if (this.engine.syncPlayerUpdatesPriority) {
                this._messenger.events.on('OPU', ({ data: [playerId, packet] }) => {
                    this.handlePacket(playerId, packet);
                });
            }
            if (this.engine.syncPlayerControls) {
                this._messenger.events.on('onControlChange', ({ data: [key, newState] }) => {
                    this.engine.player.controls[key] = newState;
                });
            }
        }
        this._messenger.events.on('setPlayerName', ({ data: [playerId, name] }) => {
            this.engine.players.get(playerId).data.name = name;
        });
        this._messenger.events.on('onPlayerCreate', ({ data: [playerId, data, streamed] }) => {
            const player = this.engine.players.create(playerId, data);
            if (streamed) {
                this.engine.players.streamIn(player);
            }
        });
        this._messenger.events.on('onPlayerDestroy', ({ data: [playerId] }) => {
            this.engine.players.destroy(this.engine.players.get(playerId));
        });
        this._messenger.events.on('onPlayerStreamIn', ({ data: [playerId, data] }) => {
            this.engine.players.streamIn(this.engine.players.get(playerId), data);
        });
        this._messenger.events.on('onPlayerStreamOut', ({ data: [playerId] }) => {
            this.engine.players.streamOut(this.engine.players.get(playerId));
        });
    }
    unload() {
        this._binded = false;
    }
    handlePacket(playerId, packet) {
        var _a;
        const player = this.get(playerId);
        if (!(player === null || player === void 0 ? void 0 : player.handle))
            return;
        if (packet.e !== undefined) {
            player.updateName(packet.e);
        }
        if (packet.l !== undefined) {
            player.updateRoles(packet.l);
        }
        if (packet.s !== undefined) {
            this._updateState(player, PLAYER_STATE_PACKET_INDEX[packet.s]);
        }
        if (packet.n !== undefined) {
            this._updateStateAnimIndex(player, packet.n);
        }
        if (packet.c !== undefined) {
            player.data.character = packet.c;
        }
        if (packet.d !== undefined) {
            player.dimension = (_a = packet.d) !== null && _a !== void 0 ? _a : 0;
        }
        if (packet.p) {
            player.location.position.set(...packet.p);
        }
        if (packet.r) {
            player.location.quaternion.set(...packet.r);
        }
        if (packet.v) {
            player.velocity.set(...packet.v);
        }
        if (packet.h) {
            player.events.emit('onHeadMove', packet.h);
        }
    }
    _updateStateAnimIndex(player, stateAnimIndex) {
        if (!player.handle.animations)
            return;
        player.handle.animations.stateAnimIndex = stateAnimIndex;
    }
    _updateState(player, newState) {
        if (!player.handle)
            return;
        player.data.state = newState;
    }
    sendMessageToAll(text) {
        this.engine.chat.sendMessageToAll(text);
    }
    sendMessageTo(player, text) {
        this.engine.chat.sendMessageTo(player, text);
    }
}

const Object$1 = null;

const Player = null;

const ENTITIES_RENDERS = {
    player: {
        EntityRender: Player,
        EntitiesManager: PlayersManager,
        EntityManager: PlayerManager,
        EntityHandle: PlayerHandleManager,
    },
    object: {
        EntityRender: Object$1,
        EntitiesManager: ObjectsManager,
        EntityManager: ObjectManager,
        EntityHandle: ObjectHandleManager,
    },
};

const LocalEngineEvents = ['onCommand'];

const isValidEnv = () => {
    if (typeof window === 'undefined') {
        return false;
    }
    if (window.self === window.top || !window.top) {
        console.debug("Client Script cannot initiate from the same page, make sure the script is added/connected to the Server's settings");
        return false;
    }
    return true;
};

const { randomBytes, secretbox } = tweetnacl;
const { decodeBase64, decodeUTF8, encodeBase64, encodeUTF8 } = tweetnaclUtil;
const newNonce = () => randomBytes(secretbox.nonceLength);
const hexToBase64Key = (hex) => {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substring(i, i + 2), 16));
    }
    return encodeBase64(new Uint8Array(bytes));
};
const encryptMessage = (data, key) => {
    const keyUint8Array = decodeBase64(key);
    const nonce = newNonce();
    const messageUint8 = decodeUTF8(JSON.stringify(data));
    const box = secretbox(messageUint8, nonce, keyUint8Array);
    const fullMessage = new Uint8Array(nonce.length + box.length);
    fullMessage.set(nonce);
    fullMessage.set(box, nonce.length);
    const base64FullMessage = encodeBase64(fullMessage);
    return base64FullMessage;
};
const decryptMessage = (messageWithNonce, key) => {
    const keyUint8Array = decodeBase64(key);
    const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce);
    const nonce = messageWithNonceAsUint8Array.slice(0, secretbox.nonceLength);
    const message = messageWithNonceAsUint8Array.slice(secretbox.nonceLength, messageWithNonce.length);
    const decrypted = secretbox.open(message, nonce, keyUint8Array);
    if (!decrypted) {
        return null;
    }
    const base64DecryptedMessage = encodeUTF8(decrypted);
    return JSON.parse(base64DecryptedMessage);
};

const CHAT_INPUT_DELIMITER_REGEX = /[{}]+/g;
const CHAT_MAX_MESSAGE_SIZE = 1024;

var NetworkSyncEvent;
(function (NetworkSyncEvent) {
    NetworkSyncEvent["SyncRequest"] = "s.r";
    NetworkSyncEvent["Ready"] = "r";
    NetworkSyncEvent["PlayerSet"] = "p.se";
    NetworkSyncEvent["PlayerUnset"] = "p.un";
    NetworkSyncEvent["PlayerUpdate"] = "p.u";
    NetworkSyncEvent["PlayerVoicechat"] = "p.v";
    NetworkSyncEvent["EntityStreamer"] = "e.s";
})(NetworkSyncEvent || (NetworkSyncEvent = {}));
var PacketEvent;
(function (PacketEvent) {
    PacketEvent["ScriptJoin"] = "s";
    PacketEvent["ScriptAction"] = "a";
    PacketEvent["Join"] = "j";
    PacketEvent["Quit"] = "q";
    PacketEvent["Update"] = "u";
    PacketEvent["Chunk"] = "c";
    PacketEvent["Voice"] = "v";
    PacketEvent["Chat"] = "h";
    PacketEvent["Sync"] = "y";
    PacketEvent["Custom"] = "n";
    PacketEvent["Discover"] = "d";
})(PacketEvent || (PacketEvent = {}));
var EntityPacketAction;
(function (EntityPacketAction) {
    EntityPacketAction[EntityPacketAction["c"] = 0] = "c";
    EntityPacketAction[EntityPacketAction["d"] = 1] = "d";
    EntityPacketAction[EntityPacketAction["a"] = 2] = "a";
    EntityPacketAction[EntityPacketAction["r"] = 3] = "r";
    EntityPacketAction[EntityPacketAction["u"] = 4] = "u";
})(EntityPacketAction || (EntityPacketAction = {}));
var PacketId;
(function (PacketId) {
    PacketId[PacketId["unknown"] = 0] = "unknown";
    PacketId[PacketId["p"] = 1] = "p";
    PacketId[PacketId["s"] = 2] = "s";
    PacketId[PacketId["c"] = 3] = "c";
    PacketId[PacketId["v"] = 4] = "v";
    PacketId[PacketId["h"] = 5] = "h";
    PacketId[PacketId["y"] = 6] = "y";
    PacketId[PacketId["n"] = 7] = "n";
    PacketId[PacketId["j"] = 8] = "j";
    PacketId[PacketId["a"] = 9] = "a";
})(PacketId || (PacketId = {}));
var PacketSource;
(function (PacketSource) {
    PacketSource[PacketSource["Server"] = 0] = "Server";
    PacketSource[PacketSource["Client"] = 1] = "Client";
})(PacketSource || (PacketSource = {}));
var PacketDestination;
(function (PacketDestination) {
    PacketDestination[PacketDestination["Server"] = 0] = "Server";
    PacketDestination[PacketDestination["Client"] = 1] = "Client";
})(PacketDestination || (PacketDestination = {}));
var StateCodeId;
(function (StateCodeId) {
    StateCodeId[StateCodeId["ConnectionAccepted"] = 0] = "ConnectionAccepted";
})(StateCodeId || (StateCodeId = {}));

const EXPIRE_TIME_MS = 60000;
class WebServerManager {
    get endpoint() {
        return this._engine.api.endpoint;
    }
    get _accessToken() {
        return this._engine.api.accessToken;
    }
    get encryptedPackets() {
        return this._engine.network.encryptedPackets;
    }
    get isServer() {
        return this._engine.api.isServer;
    }
    get isClient() {
        return this._engine.api.isClient;
    }
    constructor(engine) {
        this.declaredCommands = [];
        this.commandPacket = null;
        this.webServerEndpoint = null;
        this._engine = engine;
        if (this._engine.params.webServer) {
            this.webServerEndpoint = this._engine.params.webServer;
        }
    }
    bind() {
        const onSync = () => {
            this.emitDiscoverPacket();
            this._engine.events.off('syncEncryptedPackets', onSync);
        };
        this._engine.events.on('syncEncryptedPackets', onSync);
    }
    handle(rawData) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof rawData !== 'string')
                return null;
            const data = this._parseEndpointData(rawData);
            if (!this._isValidEndpointPacket(data)) {
                console.debug(`[api] invalid encoded data`, data);
                if (!(data === null || data === void 0 ? void 0 : data[2])) {
                    console.debug(`[api] is Access Token correct?`);
                }
                return {
                    error: 'invalid encoded data',
                };
            }
            const [eventId, packetData, authPacket, commandPacket] = data;
            if (!this._createPlayerFromAuthPacket(authPacket)) {
                return null;
            }
            if (commandPacket && !this._createCommandPacket(commandPacket)) {
                return null;
            }
            return (_a = this._handlePacket(eventId, packetData)) !== null && _a !== void 0 ? _a : null;
        });
    }
    _createCommandPacket(packet) {
        const commandPacket = this._engine.api.decryptPacket(packet);
        if (!Array.isArray(commandPacket)) {
            console.debug('[api] cannot decrypt command packet', packet);
            return false;
        }
        const [date, command, roles] = commandPacket;
        const diff = Math.floor(Date.now() / 1000) - date;
        if (diff > EXPIRE_TIME_MS) {
            console.debug(`[api] expired command packet: ${commandPacket[0][0]} | diff: ${diff}`, commandPacket);
            return false;
        }
        this.commandPacket = [command, roles];
        return true;
    }
    hasAccess(player, command) {
        if (!this.declaredCommands.includes(command)) {
            return true;
        }
        if (!this.commandPacket) {
            return false;
        }
        const [cmd, roles] = this.commandPacket;
        if (cmd !== command) {
            return false;
        }
        const hasRole = player.roles.some(e => roles.includes(e));
        if (!hasRole) {
            return false;
        }
        return true;
    }
    _createPlayerFromAuthPacket(packet) {
        const authPacket = this._engine.api.decryptPacket(packet);
        if (!Array.isArray(authPacket)) {
            console.debug('[api] cannot decrypt packet, do we have the correct Access Token?', packet);
            return false;
        }
        const [date, playerId, roles, commands] = authPacket;
        const diff = Math.floor(Date.now() / 1000) - date;
        if (diff > EXPIRE_TIME_MS) {
            console.debug(`[api] expired packet playerId: ${playerId} | diff: ${diff}`);
            return false;
        }
        this.declaredCommands = commands;
        this._engine.playerId = playerId;
        this._engine.players.create(playerId, {
            roles,
        });
        return true;
    }
    _isValidEndpointPacket(data) {
        if (!Array.isArray(data)) {
            return false;
        }
        if (data.length !== 4) {
            console.log('22aac');
            return false;
        }
        if (typeof data[0] !== 'string') {
            return false;
        }
        if (data[1] !== null && !isObject(data[1])) {
            return false;
        }
        if (typeof data[2] !== 'string') {
            return false;
        }
        if (data[3] !== null && typeof data[3] !== 'string') {
            return false;
        }
        return true;
    }
    _discoverPacket() {
        const discoverPacket = {
            commands: [],
        };
        this._engine.commands.commands.forEach(command => {
            discoverPacket.commands.push(Object.assign(Object.assign({}, command.toObject()), { tag: this._engine.name }));
        });
        return discoverPacket;
    }
    _handlePacket(event, packet) {
        switch (event) {
            case PacketEvent.Discover: {
                return this._discoverPacket();
            }
            case PacketEvent.Chat: {
                const parsed = zod.z
                    .object({
                    m: zod.z.string().min(1).max(CHAT_MAX_MESSAGE_SIZE),
                })
                    .parse(packet);
                this._engine.messenger.emitLocal('onChat', [parsed.m]);
                break;
            }
            case PacketEvent.Custom: {
                const parsed = zod.z
                    .object({
                    e: zod.z.string().min(1).max(256),
                    d: zod.z.object({}).passthrough().optional(),
                })
                    .parse(packet);
                this._engine.messenger.emitLocal(`onPlayerCustomEvent_${parsed.e}`, [
                    this._engine.player.id,
                    parsed.d,
                ]);
                break;
            }
            default: {
                console.debug(`[webserver] unhandled packet: ${event}`);
            }
        }
        return null;
    }
    _parseEndpointData(data) {
        try {
            return JSON.parse(data);
        }
        catch (e) {
            console.error(e);
        }
        return null;
    }
    emitToWebServer(event, data, commandPacket) {
        var _a, _b;
        if (!this.webServerEndpoint || !this.isClient)
            return;
        if (!((_a = this.encryptedPackets) === null || _a === void 0 ? void 0 : _a.auth)) {
            console.debug('[api] encypted packets not found, is the "Access Token" generated?');
            return;
        }
        const packet = [
            event,
            data !== null && data !== void 0 ? data : null,
            (_b = this.encryptedPackets) === null || _b === void 0 ? void 0 : _b.auth,
            commandPacket !== null && commandPacket !== void 0 ? commandPacket : null,
        ];
        return fetch(this.webServerEndpoint, {
            method: 'POST',
            cache: 'no-cache',
            keepalive: true,
            referrerPolicy: 'no-referrer',
            credentials: 'omit',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(packet),
        });
    }
    emitAction(eventName, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isServer)
                return;
            const path = `${this.endpoint}/network/action/run`;
            const response = yield fetch(path, {
                method: 'POST',
                cache: 'no-cache',
                keepalive: true,
                referrerPolicy: 'no-referrer',
                credentials: 'omit',
                body: JSON.stringify({
                    e: eventName,
                    d: args,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this._accessToken}`,
                },
            });
            if (response.status < 200 || response.status > 299) {
                try {
                    console.error('Verza API', path, JSON.stringify(yield response.json(), null, 2));
                }
                catch (e) {
                    console.error('Verza API Error ', path, yield response.text());
                    console.error(e);
                }
            }
        });
    }
    emitDiscoverPacket() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield ((_a = (yield this.emitToWebServer(PacketEvent.Discover))) === null || _a === void 0 ? void 0 : _a.json());
            if (!result)
                return;
            if (result.error) {
                console.error(`[webserver] error `, result);
                return;
            }
            if (result.commands) {
                (_b = result.commands) === null || _b === void 0 ? void 0 : _b.forEach(command => {
                    this._engine.commands.registerWebServerCommand(command);
                });
            }
        });
    }
    emitChatPacket(text, commandPacket) {
        const chatPacket = {
            m: text,
        };
        this.emitToWebServer(PacketEvent.Chat, chatPacket, commandPacket);
    }
    emitCustomPacket(dto) {
        this.emitToWebServer(PacketEvent.Custom, dto);
    }
}
const isObject = (value) => {
    return (value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        value !== null);
};

class SyncManager {
    get players() {
        return this._engine.players;
    }
    constructor(engine) {
        this.events = new EventsManager();
        this._engine = engine;
        this._bind();
    }
    _bind() {
        this.events.on(NetworkSyncEvent.PlayerSet, packet => {
            this.players.create(packet.i, {
                name: packet.e,
                state: PLAYER_STATE_PACKET_INDEX[packet.s],
                stateAnimIndex: packet.n,
                character: packet.c,
                roles: packet.l,
            });
            this.players.handlePacket(packet.i, packet);
        });
        this.events.on(NetworkSyncEvent.PlayerUnset, playerId => {
            this.players.destroy(this.players.get(playerId));
        });
        this.events.on(NetworkSyncEvent.PlayerUpdate, packet => {
            this.players.handlePacket(packet.i, packet);
        });
        this.events.on(NetworkSyncEvent.EntityStreamer, (playerId, entityId, entityType, action) => {
            var _a;
            const player = this.players.get(playerId);
            if (!player)
                return;
            const entity = this._engine.entities[entityType].get(entityId);
            (_a = entity === null || entity === void 0 ? void 0 : entity.streamer) === null || _a === void 0 ? void 0 : _a.sync(player, action);
        });
        this.events.on(NetworkSyncEvent.PlayerVoicechat, (playerId1, playerId2, status) => {
            const player1 = this.players.get(playerId1);
            const player2 = this.players.get(playerId2);
            if (!player1 || !player2)
                return;
            if (status) {
                player1.voicechat.connect(player2);
            }
            else {
                player1.voicechat.disconnect(player2);
            }
        });
        this.events.on(NetworkSyncEvent.Ready, () => {
            console.debug('[VerzaServer] Server synced');
            this._engine.messenger.emitLocal('onSynced');
        });
    }
}

const WS_NAMESPACE = 'n';
class WebsocketServerManager {
    get endpoint() {
        return this._engine.api.endpoint;
    }
    get _accessToken() {
        return this._engine.api.accessToken;
    }
    constructor(engine) {
        this.socket = null;
        this.server = null;
        this.sync = null;
        this._scriptsRoomId = null;
        this._handlePacket = (packet) => {
            var _a;
            switch (packet.t) {
                case PacketId.j: {
                    this.sync.events.emit(...(Array.isArray(packet.d) ? packet.d : []));
                    break;
                }
                case PacketId.a: {
                    const dto = packet;
                    this._engine.api.emitLocalAction(dto.e, ((_a = dto.d) !== null && _a !== void 0 ? _a : []));
                    break;
                }
            }
        };
        this._engine = engine;
        this.sync = new SyncManager(engine);
    }
    _fetchServer() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.endpoint}/network/action/server`, {
                method: 'GET',
                cache: 'no-cache',
                keepalive: true,
                referrerPolicy: 'no-referrer',
                credentials: 'omit',
                headers: {
                    Authorization: `Bearer ${this._accessToken}`,
                },
            });
            if (response.status < 200 || response.status > 299) {
                try {
                    console.error('Verza API', JSON.stringify(yield response.json(), null, 2));
                }
                catch (e) {
                    console.error('Verza API Error ', yield response.text());
                    throw e;
                }
            }
            return (yield response.json()).data;
        });
    }
    _cleanup() {
        return __awaiter(this, void 0, void 0, function* () {
            this._engine.controller.data.synced = false;
            this._engine.objects.entitiesMap.clear();
            this._engine.players.entitiesMap.clear();
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._accessToken) {
                console.debug('[api] accessToken is missing');
                return;
            }
            this.disconnect();
            this.socket = socket_ioClient.io(`${this.endpoint}/${WS_NAMESPACE}`, {
                path: '/websockets',
                withCredentials: true,
                query: {
                    api_key: this._accessToken,
                },
                transports: ['websocket'],
                upgrade: false,
                parser: msgpackParser,
                autoConnect: false,
                reconnection: true,
                timeout: 5000,
            });
            const onConnect = () => __awaiter(this, void 0, void 0, function* () {
                console.info(`%c[VerzaServer] Connected to (${this.server.id} | region: ${this.server.region})`, 'color: #5b75ff');
                if (!this.socket.active) {
                    return;
                }
                this._engine.messenger.emitLocal('onConnect');
                this.socket.emit(PacketEvent.ScriptJoin);
            });
            const onReconnect = () => {
                console.info(`%c[VerzaServer] Reconnected!`, 'color: #5b75ff');
            };
            const onReconnectAttempt = () => {
                console.info(`%c[VerzaServer] Reconnect attempt!`, 'color: #5b75ff');
            };
            const onException = (err) => {
                console.warn(`[VerzaServer] ${WS_NAMESPACE}`, err);
            };
            const onDisconnect = () => {
                console.info(`%c[VerzaServer] Disconnected!`, 'color: #fe547e');
                this._cleanup();
                this._engine.messenger.emitLocal('onDisconnect');
            };
            this.server = yield this._fetchServer();
            this._scriptsRoomId = `s/${this.server.id}/s`;
            if (!this.socket)
                return;
            this.socket.on(this._scriptsRoomId, this._handlePacket);
            this.socket.on('connect', onConnect);
            this.socket.on('reconnect_attempt', onReconnectAttempt);
            this.socket.on('reconnect', onReconnect);
            this.socket.on('exception', onException);
            this.socket.on('disconnect', onDisconnect);
            this.socket.connect();
        });
    }
    disconnect() {
        if (!this.socket)
            return;
        this.socket.disconnect();
        this.socket = null;
    }
    emitAction(eventName, args) {
        return __awaiter(this, void 0, void 0, function* () {
            this.socket.emit(PacketEvent.ScriptAction, {
                e: eventName,
                d: args,
            });
        });
    }
}

const DEFAULT_ENV_ACCESS_TOKEN_NAME = 'VERZA_ACCESS_TOKEN';
const PROD_ENDPOINT = 'https://api.verza.io';
const DEV_ENDPOINT = 'https://dev-api.verza.io';
class ApiManager {
    get webServerEndpoint() {
        return this.webServer.webServerEndpoint;
    }
    get isWebServerAvailable() {
        return this.isClient && !!this.webServerEndpoint;
    }
    get isWebServer() {
        return this.isServer && !this.websocketServer;
    }
    get isWebsocketServer() {
        return this.isServer && !!this.websocketServer;
    }
    get isServer() {
        return this.isApi;
    }
    get isClient() {
        return !this.isApi;
    }
    get isApi() {
        return !!this.accessToken;
    }
    get network() {
        return this._engine.network;
    }
    get encryptedPackets() {
        return this._engine.network.encryptedPackets;
    }
    constructor(engine) {
        this.server = null;
        this.endpoint = PROD_ENDPOINT;
        this.websocketServer = null;
        this.webServer = null;
        this.accessToken = null;
        this._accessTokenBase64 = null;
        this._engine = engine;
        this._setEndpoint();
        this._setAccessToken();
        this.webServer = new WebServerManager(engine);
    }
    bind() {
        if (this.isWebServerAvailable) {
            this.webServer.bind();
        }
    }
    _setEndpoint() {
        var _a;
        const { environment, apiEndpoint } = this._engine.params;
        if (apiEndpoint) {
            this.endpoint = apiEndpoint;
            return;
        }
        if (typeof process !== 'undefined' && ((_a = process.env) === null || _a === void 0 ? void 0 : _a['VERZA_API_ENDPOINT'])) {
            this.endpoint = process.env['VERZA_API_ENDPOINT'];
            return;
        }
        switch (environment) {
            case 'prod': {
                this.endpoint = PROD_ENDPOINT;
                break;
            }
            case 'dev': {
                this.endpoint = DEV_ENDPOINT;
                break;
            }
        }
    }
    _setAccessToken() {
        var _a;
        let accessToken = this._engine.params.accessToken;
        if (!accessToken) {
            if (typeof process !== 'undefined' &&
                ((_a = process.env) === null || _a === void 0 ? void 0 : _a[DEFAULT_ENV_ACCESS_TOKEN_NAME])) {
                accessToken = process.env[DEFAULT_ENV_ACCESS_TOKEN_NAME];
            }
            if (!accessToken)
                return;
        }
        if (!this.endpoint.startsWith('http://localhost') &&
            typeof window !== 'undefined') {
            throw new Error('DO NOT INCLUDE THE "ACCESS TOKEN" IN CLIENT-SIDE SCRIPTS');
        }
        this.accessToken = accessToken;
        this._accessTokenBase64 = hexToBase64Key(this.accessToken);
    }
    encryptPacket(data) {
        return encryptMessage(data, this._accessTokenBase64);
    }
    decryptPacket(data) {
        return decryptMessage(data, this._accessTokenBase64);
    }
    handle(rawData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.webServer.handle(rawData);
        });
    }
    emitAction(eventName, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isClient) {
                this._engine.messenger.emit(eventName, args);
                return;
            }
            this.emitActionToServer(eventName, args);
        });
    }
    emitActionToServer(eventName, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.webServer) {
                this.webServer.emitAction(eventName, args);
            }
            else {
                this.websocketServer.emitAction(eventName, args);
            }
        });
    }
    emitLocalAction(eventName, args) {
        return __awaiter(this, void 0, void 0, function* () {
            this._engine.messenger.emitLocal(eventName, args);
        });
    }
    connectWs() {
        if (!this.websocketServer) {
            this.websocketServer = new WebsocketServerManager(this._engine);
        }
        this.websocketServer.connect();
    }
    destroy() {
        var _a;
        (_a = this.websocketServer) === null || _a === void 0 ? void 0 : _a.disconnect();
    }
}

class CameraManager {
    get _messenger() {
        return this._engine.messenger;
    }
    get position() {
        return this.camera.position;
    }
    get rotation() {
        return this.camera.rotation;
    }
    get quaternion() {
        return this.camera.quaternion;
    }
    constructor(engine) {
        this.camera = new three.PerspectiveCamera();
        this._engine = engine;
    }
    bind() {
        if (this._engine.syncCameraPosition) {
            this._messenger.events.on('OCU', ({ data: [position, quaternion] }) => {
                this.camera.position.set(...position);
                this.camera.quaternion.set(...quaternion);
            });
        }
    }
}

class ChatManager {
    get _messenger() {
        return this._engine.messenger;
    }
    constructor(engine) {
        this._engine = engine;
    }
    escapeText(text) {
        var _a;
        return (_a = (text !== null && text !== void 0 ? text : '')) === null || _a === void 0 ? void 0 : _a.replace(CHAT_INPUT_DELIMITER_REGEX, '');
    }
    sendMessageToAll(text) {
        if (!this._engine.isServer) {
            throw new Error('sendMessageToAll is only available on server-side');
        }
        this._engine.api.emitAction('sendMessage', [text]);
    }
    sendMessageTo(player, text) {
        const playerId = typeof player === 'number' ? player : player.id;
        this._engine.api.emitAction('sendMessage', [text, playerId]);
    }
}

class CommandsManager {
    constructor(engine) {
        this.commands = new Map();
        this._binded = false;
        this.noAccessMessage = `{c5c5c5}You don't have access to`;
        this._engine = engine;
    }
    _bind() {
        if (this._binded)
            return;
        this._binded = true;
        if (this._engine.api.isClient || this._engine.api.isWebsocketServer) {
            if (this._engine.synced) {
                this.commands.forEach(command => {
                    this.registerForPlayers(command);
                });
            }
            else {
                this._engine.events.on('onSynced', () => {
                    this.commands.forEach(command => {
                        this.registerForPlayers(command);
                    });
                });
            }
        }
        if (this._engine.api.isWebsocketServer) {
            this._engine.players.events.on('onConnect', player => {
                if (!this._engine.synced)
                    return;
                this.commands.forEach(command => {
                    this.registerForPlayer(player, command);
                });
            });
        }
        this._engine.events.on('onChat', (text, playerId) => {
            var _a;
            const player = playerId !== undefined
                ? this._engine.players.get(playerId)
                : this._engine.player;
            if (!player) {
                console.debug(`[chat] playerId: ${playerId} not found`);
                return;
            }
            if (text.startsWith('/') === false || text.startsWith('/+') === true) {
                return;
            }
            if (text.length === 1)
                return;
            const command = text.substring(1);
            const key = this.findByKey(command);
            if (key) {
                if (this._engine.api.isWebServer) {
                    if (!this._engine.api.webServer.hasAccess(player, key)) {
                        player.sendMessage(`${this.noAccessMessage} /${key}`);
                        return;
                    }
                }
                else {
                    if (!player.hasAccess(key)) {
                        player.sendMessage(`${this.noAccessMessage} /${key}`);
                        return;
                    }
                }
                (_a = this.commands
                    .get(key)) === null || _a === void 0 ? void 0 : _a.process(player, command.substring(key.length).trim());
            }
            else {
                if (this._engine.api.isWebServerAvailable) {
                    const packet = this.findCommandPacketByKey(command);
                    this._engine.api.webServer.emitChatPacket(text, packet);
                }
            }
            this._engine.events.emit('onCommand', command);
        });
    }
    findByKey(command) {
        const cmd = command.toLowerCase();
        if (cmd[1] === '+')
            return;
        if (this.commands.has(cmd)) {
            return cmd;
        }
        return [...this.commands.keys()].find(key => {
            return cmd.startsWith(`${key} `);
        });
    }
    findCommandPacketByKey(command) {
        const cmd = command.toLowerCase();
        if (cmd[1] === '+')
            return;
        const commands = this._engine.network.encryptedPackets.commands;
        if (!commands)
            return;
        if (commands[cmd]) {
            return commands[cmd];
        }
        const found = Object.keys(commands).find(key => {
            if (cmd.startsWith(`${key} `)) {
                return true;
            }
        });
        if (found) {
            return commands[found];
        }
    }
    registerForPlayers(command) {
        if (this._engine.destroyed)
            return;
        if (this._engine.isClient) {
            this._engine.messenger.emit('registerCommand', [
                this._engine.player.id,
                command.toObject(),
                this._engine.name,
            ]);
            return;
        }
        if (this._engine.api.isWebsocketServer) {
            const commandJson = command.toObject();
            this._engine.players.entitiesMap.forEach(player => {
                this._engine.api.emitActionToServer('registerCommand', [
                    player.id,
                    commandJson,
                    this._engine.name,
                ]);
            });
        }
    }
    registerForPlayer(player, command) {
        if (this._engine.destroyed)
            return;
        if (this._engine.isClient) {
            this._engine.messenger.emit('registerCommand', [
                player.id,
                command.toObject(),
                this._engine.name,
            ]);
            return;
        }
        if (this._engine.api.isWebsocketServer) {
            this._engine.api.emitActionToServer('registerCommand', [
                player.id,
                command.toObject(),
                this._engine.name,
            ]);
        }
    }
    unregisterForPlayers(command) {
        if (this._engine.destroyed)
            return;
        if (this._engine.isClient) {
            this._engine.messenger.emit('unregisterCommand', [
                this._engine.player.id,
                command.command,
            ]);
            return;
        }
        if (this._engine.api.isWebsocketServer) {
            this._engine.players.entitiesMap.forEach(player => {
                this._engine.api.emitActionToServer('unregisterCommand', [
                    player.id,
                    command.command,
                ]);
            });
        }
    }
    unregisterForPlayer(player, command) {
        if (this._engine.destroyed)
            return;
        if (this._engine.isClient) {
            this._engine.messenger.emit('unregisterCommand', [
                player.id,
                command.command,
            ]);
            return;
        }
        if (this._engine.api.isWebsocketServer) {
            this._engine.api.emitActionToServer('unregisterCommand', [
                player.id,
                command.command,
            ]);
        }
    }
    register(command) {
        this._bind();
        this.unregister(command);
        this.commands.set(command.command.toLowerCase(), command);
        if (this._engine.synced) {
            this.registerForPlayers(command);
        }
    }
    unregister(command) {
        if (!this.commands.has(command.command.toLowerCase()))
            return;
        this.commands.delete(command.command.toLowerCase());
        if (this._engine.synced) {
            this.unregisterForPlayers(command);
        }
    }
    registerWebServerCommand(command) {
        var _a;
        this._engine.messenger.emit('registerCommand', [
            this._engine.player.id,
            command,
            (_a = command.tag) !== null && _a !== void 0 ? _a : this._engine.name,
        ]);
    }
    destroy() {
        this._binded = false;
    }
}

class ControllerManager {
    constructor(data) {
        this.events = new EventsManager();
        this.data = data;
    }
    set(name, value) {
        this.data[name] = value;
        this.events.emit(name, value, name);
        return value;
    }
    get(name) {
        return this.data[name];
    }
}

const TYPE_HANDSHAKE_CONNECTION = 'HANDSHAKE_CONNECTION';
const ACTION_CONNECT = 'REQUEST';
const ACTION_ACCEPT = 'ACCEPT';
class MessengerManager {
    constructor(type, id) {
        this.id = null;
        this.channel = null;
        this.port = null;
        this.validators = null;
        this.connected = false;
        this._onHandshake = (message) => {
            var _a, _b, _c;
            if (((_a = message.data) === null || _a === void 0 ? void 0 : _a.type) !== TYPE_HANDSHAKE_CONNECTION)
                return;
            if (((_b = message.data) === null || _b === void 0 ? void 0 : _b.id) !== this.id) {
                if (this.type !== 'receiver') {
                    console.debug(`[messenger:${this.type}] sender id mismatch "${this.id}" != "${(_c = message.data) === null || _c === void 0 ? void 0 : _c.id}"`);
                }
                return;
            }
            if (typeof message.data.type !== 'string') {
                console.log(`[messenger:${this.type}] type must be a string`);
                return;
            }
            if (typeof message.data.action !== 'string') {
                console.log(`[messenger:${this.type}] action must be a string`);
                return;
            }
            if (this.type === 'receiver' && message.data.action === ACTION_CONNECT) {
                console.debug(`ACTION_CONNECT:${this.id.split('-')[0]}`);
                if (!message.ports.length) {
                    console.log(`[messenger:${this.type}] port is missing`);
                    return;
                }
                this.accept(message.ports[0]);
                this.events.emit('onConnect');
                this._onConnected();
                return;
            }
            if (this.type === 'sender' && message.data.action === ACTION_ACCEPT) {
                console.debug(`ACTION_ACCEPT:${this.id.split('-')[0]}`);
                this.events.emit('onConnect');
                this._onConnected();
                return;
            }
            console.debug(`[messenger:${this.type}] unhandled request`);
        };
        this._onMessage = (message) => {
            var _a, _b, _c, _d, _e, _f;
            if (((_a = message.data) === null || _a === void 0 ? void 0 : _a.type) === TYPE_HANDSHAKE_CONNECTION) {
                this._onHandshake(message);
                return;
            }
            if (!Array.isArray(message.data) || !message.data.length) {
                console.debug(`[messenger:] message.data must be an array`);
                return;
            }
            const event = message.data.pop();
            if ((_b = this.validators) === null || _b === void 0 ? void 0 : _b[event]) {
                try {
                    const validator = (_c = this.validators[event]) !== null && _c !== void 0 ? _c : {};
                    Object.assign(message.data, (_e = (_d = validator === null || validator === void 0 ? void 0 : validator.parser) === null || _d === void 0 ? void 0 : _d.parse(message.data)) !== null && _e !== void 0 ? _e : {});
                    (_f = validator === null || validator === void 0 ? void 0 : validator.callback) === null || _f === void 0 ? void 0 : _f.call(validator, message);
                }
                catch (e) {
                    console.error(e);
                    return;
                }
            }
            if (event === 'register') {
                this.events.registeredEvents.add(message.data[0]);
                return;
            }
            else if (event === 'unregister') {
                this.events.registeredEvents.delete(message.data[0]);
                return;
            }
            this.events.emit(event, message);
        };
        this.type = type;
        this.events = new MessengerEvents(this);
        if (typeof window === 'undefined')
            return;
        this.id = id !== null && id !== void 0 ? id : window.name;
        this._bindHandshakeListener();
    }
    setValidators(validators) {
        this.validators = validators;
    }
    connect(windowToConnect) {
        if (this.type !== 'sender') {
            console.log(`[messenger:${this.type}] only senders can connect`);
            return;
        }
        if (this.type === 'sender') {
            this.channel = new MessageChannel();
            this.port = this.channel.port1;
            this.port.onmessage = this._onMessage;
        }
        windowToConnect.postMessage({
            id: this.id,
            type: TYPE_HANDSHAKE_CONNECTION,
            action: ACTION_CONNECT,
        }, '*', [this.channel.port2]);
    }
    accept(port) {
        if (this.type !== 'receiver') {
            console.log(`[messenger:${this.type}] only receivers can accept`);
            return;
        }
        this._disconnectPort();
        this.port = port;
        this.port.onmessage = this._onMessage;
        this.port.postMessage({
            id: this.id,
            type: TYPE_HANDSHAKE_CONNECTION,
            action: ACTION_ACCEPT,
        });
    }
    _disconnectPort() {
        if (!this.port)
            return;
        this.port.onmessage = null;
        this.port.close();
        this.port = null;
    }
    disconnect() {
        this._unbindHandshakeListener();
        this._disconnectPort();
        if (this.channel) {
            this.channel = null;
        }
        this.connected = false;
    }
    _bindHandshakeListener() {
        this._unbindHandshakeListener();
        window.addEventListener('message', this._onHandshake);
    }
    _unbindHandshakeListener() {
        window.removeEventListener('message', this._onHandshake);
    }
    _onConnected() {
        this.connected = true;
        this.events.emitRegisteredEvents();
        this.emit('onLoad');
    }
    canEmit(eventName) {
        return this.events.registeredEvents.has(eventName);
    }
    emitLocal(eventName, args) {
        return __awaiter(this, void 0, void 0, function* () {
            this._onMessage({
                data: args ? [...args, eventName] : [eventName],
            });
        });
    }
    emit(eventName, args, transfer) {
        if (!this.port)
            return;
        if (this.type !== 'sender' && !this.canEmit(eventName)) {
            return;
        }
        if (transfer) {
            this.port.postMessage(args ? [...args, eventName] : [eventName], transfer);
            return;
        }
        this.port.postMessage(args ? [...args, eventName] : [eventName]);
    }
    destroy() {
        this.disconnect();
        this.events.removeAllListeners();
    }
}
class MessengerEvents extends EventsManager {
    constructor(messenger) {
        super();
        this.registerEvents = false;
        this.registeredEvents = new Set();
        this._messenger = messenger;
    }
    on(eventName, listener) {
        this._register(eventName);
        return super.on(eventName, listener);
    }
    off(eventName, listener) {
        super.off(eventName, listener);
        this._unregister(eventName);
    }
    once(eventName, listener) {
        console.debug('[MessengerEvents] events.once not available');
        return listener;
    }
    removeAllListeners() {
        super.removeAllListeners();
        this.registeredEvents.forEach(event => this._unregister(event));
    }
    _register(eventName) {
        if (this.registerEvents && !this.registeredEvents.has(eventName)) {
            this.registeredEvents.add(eventName);
            if (this._messenger.connected) {
                this._messenger.emit('register', [eventName]);
            }
        }
    }
    _unregister(eventName) {
        if (this.registerEvents &&
            this.getEmitter().listenerCount(eventName) === 0) {
            this.registeredEvents.delete(eventName);
            if (this._messenger.connected) {
                this._messenger.emit('unregister', [eventName]);
            }
        }
    }
    emitRegisteredEvents() {
        if (!this.registerEvents)
            return;
        this.registeredEvents.forEach(eventName => {
            this._messenger.emit('register', [eventName]);
        });
    }
}

const MAX_CLIENT_OBJECT_SIZE = 10240;

class NetworkManager {
    get _api() {
        return this._engine.api;
    }
    get _isClient() {
        return this._engine.api.isClient;
    }
    get _isServer() {
        return this._engine.api.isServer;
    }
    get _messenger() {
        return this._engine.messenger;
    }
    constructor(engine) {
        this.server = null;
        this.serverCommands = new Map();
        this.encryptedPackets = null;
        this._engine = engine;
    }
    bind() {
        if (this._isServer)
            return;
        this._messenger.events.on('syncServer', ({ data: [server, endpoint] }) => {
            this._api.endpoint = endpoint;
            this.server = server;
            this.serverCommands = new Map(server.commands.map(e => [e.command, e]));
        });
        this._messenger.events.on('syncEncryptedPackets', ({ data: [encryptedPackets] }) => {
            this.encryptedPackets = encryptedPackets;
        });
    }
    onPlayerEvent(event, listener) {
        const listenerWrapper = (playerId, data) => {
            listener(this._engine.players.get(playerId), data);
        };
        return this._engine.events.on(`onPlayerCustomEvent_${event}`, listenerWrapper);
    }
    onServerEvent(event, listener) {
        if (this._isServer) {
            throw new Error("You can't use network.onServerEvent server-side. If you're receving an event form the client use network.onPlayerEvent instead");
        }
        const listenerWrapper = (data) => {
            listener(data);
        };
        return this._engine.events.on(`onServerCustomEvent_${event}`, listenerWrapper);
    }
    offServerEvent(event, listener) {
        return this._engine.events.off(`onServerCustomEvent_${event}`, listener);
    }
    offPlayerEvent(event, listener) {
        return this._engine.events.off(`onPlayerCustomEvent_${event}`, listener);
    }
    emitToServer(event, data) {
        if (!this._checkPacketSize(data === null || data === void 0 ? void 0 : data.d))
            return;
        if (this._api.isWebServerAvailable) {
            this._api.webServer.emitCustomPacket({
                p: PacketDestination.Server,
                e: event,
                d: data,
            });
        }
        this._api.emitAction('emitToServer', [event, data]);
    }
    emitToPlayers(event, data) {
        if (!this._checkPacketSize(data === null || data === void 0 ? void 0 : data.d))
            return;
        if (this._api.isWebServerAvailable) {
            this._api.webServer.emitCustomPacket({
                p: PacketDestination.Client,
                e: event,
                d: data,
            });
        }
        this._api.emitAction('emitToPlayers', [event, data]);
    }
    emitToPlayer(player, event, data) {
        if (!this._checkPacketSize(data === null || data === void 0 ? void 0 : data.d))
            return;
        const playerId = typeof player === 'number' ? player : player.id;
        if (this._api.isWebServerAvailable) {
            this._api.webServer.emitCustomPacket({
                p: PacketDestination.Client,
                e: event,
                d: data,
                i: playerId,
            });
        }
        this._api.emitAction('emitToPlayer', [playerId, event, data]);
    }
    _checkPacketSize(data) {
        if (data && JSON.stringify(data).length >= MAX_CLIENT_OBJECT_SIZE) {
            console.debug(`[network] event data exceed the size limit (max: ${MAX_CLIENT_OBJECT_SIZE})`);
            return false;
        }
        return true;
    }
}

const INTERFACE_OPTIONS = 'interface-options';

class UIManager {
    get interfaces() {
        return this.controller.get('interfaces');
    }
    get cursorLock() {
        return this.controller.get('cursorLock');
    }
    get isActiveInput() {
        var _a;
        return ((_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.tagName) === 'INPUT';
    }
    get activeInput() {
        return this.isActiveInput
            ? document.activeElement
            : null;
    }
    get _messenger() {
        return this._engine.messenger;
    }
    constructor(engine) {
        this.visible = false;
        this.controller = new ControllerManager({
            interfaces: new Set(),
            cursorLock: false,
        });
        this._onEscapeKey = (event) => {
            if (event.code !== 'Escape')
                return;
            this._messenger.emit('onEscapeKey');
        };
        this._engine = engine;
    }
    bind() {
        document.addEventListener('keyup', this._onEscapeKey);
        this._messenger.events.on('addInterface', ({ data: [tag] }) => {
            this.interfaces.add(tag);
            this.controller.set('interfaces', new Set(this.interfaces));
        });
        this._messenger.events.on('removeInterface', ({ data: [tag] }) => {
            this.interfaces.delete(tag);
            this.controller.set('interfaces', new Set(this.interfaces));
        });
        this._messenger.events.on('onCursorLock', ({ data: [status] }) => {
            this.controller.set('cursorLock', status);
        });
    }
    addInterface(tag) {
        this._messenger.emit('addInterface', [tag]);
    }
    removeInterface(tag) {
        this._messenger.emit('removeInterface', [tag]);
    }
    hasInterface(tag) {
        return this.interfaces.has(tag);
    }
    isOptionsMenu() {
        return this.hasInterface(INTERFACE_OPTIONS);
    }
    setSize(props) {
        this._messenger.emit('onSetSize', [props]);
    }
    show() {
        this.visible = true;
        this._messenger.emit('onShow');
    }
    hide() {
        this.visible = false;
        this._messenger.emit('onHide');
    }
    destroy() {
        document.removeEventListener('keyup', this._onEscapeKey);
    }
}

class EngineManager {
    get name() {
        var _a;
        return ((_a = this.params.name) !== null && _a !== void 0 ? _a : this.messenger.id.substring(0, this.messenger.id.indexOf('-')));
    }
    get syncPlayers() {
        var _a;
        return (_a = this.params.syncPlayers) !== null && _a !== void 0 ? _a : true;
    }
    get syncPlayerUpdatesPriority() {
        var _a;
        return (_a = this.params.syncPlayerUpdatesPriority) !== null && _a !== void 0 ? _a : false;
    }
    get syncPlayerUpdates() {
        var _a;
        return (_a = this.params.syncPlayerUpdates) !== null && _a !== void 0 ? _a : true;
    }
    get syncPlayerControls() {
        var _a;
        return (_a = this.params.syncPlayerControls) !== null && _a !== void 0 ? _a : true;
    }
    get syncCameraPosition() {
        var _a;
        return (_a = this.params.syncCameraPosition) !== null && _a !== void 0 ? _a : false;
    }
    get synced() {
        return this.controller.data.synced;
    }
    get connected() {
        return this.controller.data.connected;
    }
    get playerId() {
        return this.controller.data.playerId;
    }
    set playerId(playerId) {
        this.controller.set('playerId', playerId);
    }
    get player() {
        return this.entities.player.get(this.playerId);
    }
    get players() {
        return this.entities.player;
    }
    get objects() {
        return this.entities.object;
    }
    get isServer() {
        return this.api.isServer;
    }
    get isClient() {
        return this.api.isClient;
    }
    constructor(params) {
        this.z = zod.z;
        this.ui = null;
        this.messenger = new MessengerManager('sender');
        this.eventsManager = new Map();
        this.events = new EngineEvents(this);
        this.params = {};
        this.camera = null;
        this.controller = new ControllerManager({
            connected: false,
            synced: false,
            playerId: null,
        });
        this.entities = {
            player: new PlayersManager(this),
            object: new ObjectsManager(this),
        };
        this.destroyed = false;
        this._binded = false;
        this.params = params !== null && params !== void 0 ? params : {};
        this.api = new ApiManager(this);
        this.messenger.events.registerEvents = true;
        this.network = new NetworkManager(this);
        if (this.isClient) {
            this.ui = new UIManager(this);
            this.camera = new CameraManager(this);
        }
        this.chat = new ChatManager(this);
        this.commands = new CommandsManager(this);
        Object.entries(ENTITIES_RENDERS).forEach(([key, value]) => {
            this.entities[key].Handler =
                value.EntityHandle;
            this.entities[key].Manager =
                value.EntityManager;
        });
    }
    connectServer() {
        this._setup();
        this.api.connectWs();
    }
    connectClient() {
        if (this.isClient && !isValidEnv()) {
            return;
        }
        this._setup();
        this.messenger.events.on('setPlayerId', ({ data: [playerId] }) => {
            this.playerId = playerId;
        });
        this.messenger.connect(window.top);
    }
    _setup() {
        var _a, _b;
        this.destroy();
        this.destroyed = false;
        this._binded = true;
        if (this.syncPlayers) {
            this.entities.player.load();
        }
        this.messenger.events.on('onConnect', () => {
            this.controller.set('connected', true);
        });
        this.messenger.events.on('onDisconnect', () => {
            this.controller.set('connected', false);
        });
        this.messenger.events.on('onSynced', () => {
            this.controller.set('synced', true);
        });
        this.network.bind();
        this.api.bind();
        (_a = this.ui) === null || _a === void 0 ? void 0 : _a.bind();
        (_b = this.camera) === null || _b === void 0 ? void 0 : _b.bind();
    }
    destroy() {
        var _a;
        if (!this._binded)
            return;
        this.destroyed = true;
        this.controller.set('connected', false);
        this.controller.set('synced', false);
        this.api.destroy();
        this.messenger.destroy();
        this.commands.destroy();
        (_a = this.ui) === null || _a === void 0 ? void 0 : _a.destroy();
        this.entities.player.unload();
        this.entities.object.unload();
        this.events.removeAllListeners();
        this.controller.events.removeAllListeners();
        this._binded = false;
    }
    restartServer(reason) {
        this.api.emitAction('restartServer', reason ? [reason] : undefined);
    }
    setForwardMessages(status) {
        this.api.emitAction('setForwardMessages', [status]);
    }
}
class EngineEvents extends EventsManager {
    constructor(engine) {
        super();
        this._bindedEvents = new Map();
        this._engine = engine;
    }
    on(eventName, listener) {
        if (!LocalEngineEvents.includes(eventName)) {
            this._bind(eventName);
        }
        return super.on(eventName, listener);
    }
    off(eventName, listener) {
        super.off(eventName, listener);
        this._unbind(eventName);
    }
    once(eventName, listener) {
        console.debug('[EngineEvents] events.once not available');
        return listener;
    }
    removeAllListeners() {
        super.removeAllListeners();
        [...this._bindedEvents.keys()].forEach(event => this._unbind(event));
    }
    _bind(eventName) {
        if (this._bindedEvents.has(eventName))
            return;
        this._bindedEvents.set(eventName, this._engine.messenger.events.on(eventName, (event) => {
            var _a;
            this.emit(eventName, ...((_a = event === null || event === void 0 ? void 0 : event.data) !== null && _a !== void 0 ? _a : []));
        }));
    }
    _unbind(eventName) {
        if (this._bindedEvents.has(eventName) &&
            this.getEmitter().listenerCount(eventName) === 0) {
            this._engine.messenger.events.off(eventName, this._bindedEvents.get(eventName));
            this._bindedEvents.delete(eventName);
        }
    }
}

const EngineContext = React.createContext(null);
const EngineProvider = ({ children, params, }) => {
    const [engine, setEngine] = React.useState(null);
    const [synced, setSynced] = React.useState(false);
    React.useEffect(() => {
        const engine = new EngineManager(params);
        engine.connectClient();
        const onSynced = engine.events.on('onSynced', () => {
            setSynced(true);
        });
        setEngine(engine);
        return () => {
            engine.events.on('onSynced', onSynced);
            engine.destroy();
            setEngine(null);
            setSynced(false);
        };
    }, []);
    if (!synced || !engine)
        return null;
    return (React.createElement(EngineContext.Provider, { value: engine }, children));
};

const useEngine = () => {
    return React.useContext(EngineContext);
};

const useEvent = (event, callback) => {
    const engine = useEngine();
    React.useEffect(() => {
        const onEvent = engine.events.on(event, callback);
        return () => {
            engine.events.off(event, onEvent);
        };
    });
};

const useFrame = (callback) => {
    React.useEffect(() => {
        let lastTime = performance.now();
        let running = true;
        const check = () => {
            requestAnimationFrame(delta => {
                if (!running)
                    return;
                try {
                    callback((delta - lastTime) / 100);
                }
                catch (e) {
                    console.log(e);
                }
                lastTime = delta;
                check();
            });
        };
        check();
        return () => {
            running = false;
        };
    }, [callback]);
};

const useOnTicks = (handler, ticks) => {
    React.useEffect(() => {
        let intervalId = null;
        const check = () => {
            handler === null || handler === void 0 ? void 0 : handler();
            intervalId = setTimeout(check, 1000 / ticks);
        };
        check();
        return () => {
            if (intervalId) {
                clearTimeout(intervalId);
            }
        };
    }, [handler, ticks]);
};

const useGameKey = (key, callback, options) => {
    const engine = useEngine();
    React.useEffect(() => {
        var _a;
        const event = (_a = options === null || options === void 0 ? void 0 : options.event) !== null && _a !== void 0 ? _a : 'keydown';
        const keys = Array.isArray(key) ? key : [key];
        const onKey = engine.events.on('onKey', keyInfo => {
            if (keyInfo.type !== event)
                return;
            if (!(options === null || options === void 0 ? void 0 : options.ignoreOptionsMenu) &&
                engine.ui.hasInterface(INTERFACE_OPTIONS)) {
                return;
            }
            if (!(options === null || options === void 0 ? void 0 : options.ignoreFlags)) {
                if (!(options === null || options === void 0 ? void 0 : options.ignoreActiveInput) && engine.ui.isActiveInput) {
                    return;
                }
            }
            if (keys.includes(keyInfo.code)) {
                callback(keyInfo);
            }
        });
        return () => {
            engine.events.off('onKey', onKey);
        };
    }, [engine, callback, key, options]);
};

const useKey = (key, callback, options) => {
    const engine = useEngine();
    useGameKey(key, callback, options);
    React.useEffect(() => {
        var _a;
        const event = (_a = options === null || options === void 0 ? void 0 : options.event) !== null && _a !== void 0 ? _a : 'keydown';
        const keys = Array.isArray(key) ? key : [key];
        const onKeyDown = (event) => {
            if (!(options === null || options === void 0 ? void 0 : options.ignoreOptionsMenu) &&
                engine.ui.hasInterface(INTERFACE_OPTIONS)) {
                return;
            }
            if (!(options === null || options === void 0 ? void 0 : options.ignoreFlags)) {
                if (!(options === null || options === void 0 ? void 0 : options.ignoreActiveInput) && engine.ui.isActiveInput) {
                    return;
                }
            }
            if (keys.includes(event.code)) {
                callback({
                    type: event.type,
                    code: event.code,
                    key: event.key,
                    altKey: event.altKey,
                    ctrlKey: event.ctrlKey,
                    metaKey: event.metaKey,
                    shiftKey: event.shiftKey,
                });
            }
        };
        document.addEventListener(event, onKeyDown);
        return () => {
            document.removeEventListener(event, onKeyDown);
        };
    }, [engine, callback, key, options]);
};

const useControllerProp = (controller, name) => {
    const [prop, setProp] = React.useState(() => controller.data[name]);
    React.useEffect(() => {
        setProp(controller.data[name]);
        const onChange = controller.events.on(name, value => {
            setProp(value);
        });
        return () => {
            controller.events.off(name, onChange);
        };
    }, [controller, name]);
    return prop;
};

const useNetwork = () => {
    return useEngine().network;
};

const useCamera = () => {
    return useEngine().camera;
};

const useChat = () => {
    return useEngine().chat;
};

const MAX_COMMAND_NAME = 64;
const MAX_COMMAND_DESC = 512;

class Command {
    constructor(commandOrParams, params) {
        this.command = null;
        this.desc = null;
        this.params = [];
        this.callback = null;
        if (typeof commandOrParams === 'string') {
            this.command = commandOrParams;
            if (params) {
                this.params = params.map(param => new CommandParam(param, param.type));
            }
        }
        else {
            const { params } = commandOrParams, rest = __rest(commandOrParams, ["params"]);
            Object.assign(this, rest);
            if (params) {
                this.params = params.map(param => new CommandParam(param, param.type));
            }
        }
        this._validateLengths();
    }
    _validateLengths() {
        var _a;
        if (this.command.length > MAX_COMMAND_NAME) {
            this.command = this.command.substring(0, MAX_COMMAND_NAME);
        }
        if (((_a = this.desc) === null || _a === void 0 ? void 0 : _a.length) > MAX_COMMAND_DESC) {
            this.desc = this.desc.substring(0, MAX_COMMAND_DESC);
        }
    }
    on(callback) {
        this.callback = callback;
        return this;
    }
    withDesc(desc) {
        var _a;
        this.desc = desc;
        if (((_a = this.desc) === null || _a === void 0 ? void 0 : _a.length) > MAX_COMMAND_DESC) {
            this.desc = this.desc.substring(0, MAX_COMMAND_DESC);
        }
        return this;
    }
    process(player, command) {
        var _a, _b;
        if ((!this.params.length && command.length) ||
            (this.params.length && !command.length)) {
            this._sendUsage(player);
            return;
        }
        if (!this.params.length) {
            (_a = this.callback) === null || _a === void 0 ? void 0 : _a.call(this, player, {});
            return;
        }
        let parts = command.split(' ');
        if (parts.length < this.params.length) {
            this._sendUsage(player);
            return;
        }
        const isLastString = this.params[this.params.length - 1].type === 'string';
        if (!isLastString && parts.length > this.params.length) {
            this._sendUsage(player);
            return;
        }
        if (isLastString && parts.length > this.params.length) {
            if (this.params.length === 1) {
                parts = [parts.join(' ')];
            }
            else {
                parts = [...parts.splice(0, this.params.length - 1), parts.join(' ')];
            }
        }
        if (parts.length !== this.params.length) {
            this._sendUsage(player);
            return;
        }
        const params = {};
        const paramError = parts.find((value, index) => {
            params[this.params[index].name] =
                this.params[index].parse(value);
            if (params[this.params[index].name] === undefined) {
                return true;
            }
            return false;
        });
        if (paramError) {
            this._sendUsage(player);
            return;
        }
        (_b = this.callback) === null || _b === void 0 ? void 0 : _b.call(this, player, params);
    }
    _sendUsage(player) {
        if (this.params.length) {
            const params = this.params.map(e => { var _a; return `[${(_a = e.display) !== null && _a !== void 0 ? _a : e.name}]`; }).join(' ');
            player.sendMessage(`{c5c5c5}Usage: /${this.command} ${params}`);
            return;
        }
        player.sendMessage(`{c5c5c5}Usage: /${this.command}`);
    }
    toObject() {
        return {
            command: this.command,
            desc: this.desc,
            params: this.params.map(e => e.toObject()),
        };
    }
}
class CommandParam {
    constructor(nameOrParams, type) {
        this.name = null;
        this.display = null;
        this.type = 'string';
        this.isRequired = true;
        if (typeof nameOrParams === 'string') {
            this.name = nameOrParams;
            if (type) {
                this.type = type;
            }
        }
        else {
            Object.assign(this, nameOrParams);
        }
        this._validateLengths();
    }
    _validateLengths() {
        var _a;
        if (this.name.length > MAX_COMMAND_NAME) {
            this.name = this.name.substring(0, MAX_COMMAND_NAME);
        }
        if (((_a = this.display) === null || _a === void 0 ? void 0 : _a.length) > MAX_COMMAND_NAME) {
            this.display = this.display.substring(0, MAX_COMMAND_NAME);
        }
    }
    parse(input) {
        let value = undefined;
        switch (this.type) {
            case 'number': {
                value = parseInt(input);
                if (value === Infinity || isNaN(value)) {
                    return undefined;
                }
                break;
            }
            case 'string': {
                value = input;
                break;
            }
            case 'user': {
                return undefined;
            }
        }
        return value;
    }
    required() {
        this.isRequired = true;
        return this;
    }
    withDisplay(display) {
        this.display = display.substring(0, MAX_COMMAND_NAME);
        return this;
    }
    toObject() {
        return {
            name: this.name,
            display: this.display,
            type: this.type,
            isRequired: this.isRequired,
        };
    }
}

const useCommand = (command, params) => {
    const engine = useEngine();
    const [cmd] = React.useState(() => {
        const cmd = new Command(command, params);
        return cmd;
    });
    React.useEffect(() => {
        engine.commands.register(cmd);
        return () => {
            engine.commands.unregister(cmd);
        };
    }, [cmd]);
    return cmd;
};

const useUI = () => {
    return useEngine().ui;
};
const useCursorLock = () => {
    return useControllerProp(useUI().controller, 'cursorLock');
};
const useInterfaces = () => {
    return useControllerProp(useUI().controller, 'interfaces');
};

const usePlayerId = () => {
    return useControllerProp(useEngine().controller, 'playerId');
};

const useObjects = () => {
    return useEngine().entities.object;
};

const usePlayers = () => {
    return useEngine().entities.player;
};

const useEntity = (id, type) => {
    const entities = useEngine().entities[type];
    return React.useMemo(() => {
        return entities === null || entities === void 0 ? void 0 : entities.get(id);
    }, [entities, id]);
};

const useObject = (id) => {
    return useEntity(id, 'object');
};

const usePlayer = (id) => {
    return useEntity(id, 'player');
};

const useStreamedEntity = (entityId, type) => {
    const entityManager = useEntity(entityId, type);
    const [entity, setEntity] = React.useState(() => {
        return (entityManager === null || entityManager === void 0 ? void 0 : entityManager.streamed) ? entityManager : null;
    });
    React.useEffect(() => {
        if (!entityManager)
            return;
        if (entityManager === null || entityManager === void 0 ? void 0 : entityManager.streamed) {
            setEntity(entityManager);
        }
        const onStreamIn = entityManager.events.on('onStreamIn', () => {
            setEntity(entityManager);
        });
        const onStreamOut = entityManager.events.on('onStreamOut', () => {
            setEntity(null);
        });
        return () => {
            entityManager.events.off('onStreamIn', onStreamIn);
            entityManager.events.off('onStreamOut', onStreamOut);
        };
    }, [entityManager]);
    return entity;
};

const useStreamedPlayer = (playerId) => {
    return useStreamedEntity(playerId, 'player');
};

const useStreamedObject = (objectId) => {
    return useStreamedEntity(objectId, 'object');
};

const setReactRef = (ref, value) => {
    if (ref) {
        ref.current = value;
    }
};

const ParentContext = React.createContext(null);
const Group = React.forwardRef((props, ref) => {
    const objects = useObjects();
    const [object, setObject] = React.useState(null);
    const parent = useParent();
    React.useEffect(() => {
        if ((parent === null || parent === void 0 ? void 0 : parent.destroyed) === true) {
            setObject(null);
            return;
        }
        const object = objects.createGroup([], Object.assign({ parentId: parent === null || parent === void 0 ? void 0 : parent.id }, props.props));
        setReactRef(ref, object);
        setObject(object);
        return () => {
            objects.destroy(object);
        };
    }, [objects, props, parent]);
    if (!object)
        return null;
    return (React.createElement(ParentContext.Provider, { value: object }, props.children));
});
Group.displayName = 'Group';
const useParent = () => {
    return React.useContext(ParentContext);
};

const Model = React.forwardRef((props, ref) => {
    const objects = useObjects();
    const parent = useParent();
    React.useEffect(() => {
        if ((parent === null || parent === void 0 ? void 0 : parent.destroyed) === true)
            return;
        const object = objects.createModel(props.type, Object.assign({ parentId: parent === null || parent === void 0 ? void 0 : parent.id }, props.props));
        setReactRef(ref, object);
        return () => {
            objects.destroy(object);
        };
    }, [objects, props, parent]);
    return null;
});
Model.displayName = 'Model';

const Box = React.forwardRef((props, ref) => {
    const objects = useObjects();
    const parent = useParent();
    React.useEffect(() => {
        if ((parent === null || parent === void 0 ? void 0 : parent.destroyed) === true)
            return;
        const object = objects.createBox(props.box, Object.assign({ parentId: parent === null || parent === void 0 ? void 0 : parent.id }, props.props));
        setReactRef(ref, object);
        return () => {
            objects.destroy(object);
        };
    }, [objects, props, parent]);
    return null;
});
Box.displayName = 'Box';

const Gltf = React.forwardRef((props, ref) => {
    const objects = useObjects();
    const parent = useParent();
    React.useEffect(() => {
        if ((parent === null || parent === void 0 ? void 0 : parent.destroyed) === true)
            return;
        const object = objects.createGltf(props.url, Object.assign({ parentId: parent === null || parent === void 0 ? void 0 : parent.id }, props.props));
        setReactRef(ref, object);
        return () => {
            objects.destroy(object);
        };
    }, [objects, props, parent]);
    return null;
});
Gltf.displayName = 'Gltf';

const Line = React.forwardRef((props, ref) => {
    const objects = useObjects();
    const parent = useParent();
    React.useEffect(() => {
        if ((parent === null || parent === void 0 ? void 0 : parent.destroyed) === true)
            return;
        const object = objects.createLine(props.points, props.color, Object.assign({ parentId: parent === null || parent === void 0 ? void 0 : parent.id }, props.props));
        setReactRef(ref, object);
        return () => {
            objects.destroy(object);
        };
    }, [objects, props, parent]);
    return null;
});
Line.displayName = 'Line';

exports.Box = Box;
exports.EngineProvider = EngineProvider;
exports.Gltf = Gltf;
exports.Group = Group;
exports.Line = Line;
exports.Model = Model;
exports.useCamera = useCamera;
exports.useChat = useChat;
exports.useCommand = useCommand;
exports.useControllerProp = useControllerProp;
exports.useCursorLock = useCursorLock;
exports.useEngine = useEngine;
exports.useEvent = useEvent;
exports.useFrame = useFrame;
exports.useGameKey = useGameKey;
exports.useInterfaces = useInterfaces;
exports.useKey = useKey;
exports.useNetwork = useNetwork;
exports.useObject = useObject;
exports.useObjects = useObjects;
exports.useOnTicks = useOnTicks;
exports.usePlayer = usePlayer;
exports.usePlayerId = usePlayerId;
exports.usePlayers = usePlayers;
exports.useStreamedObject = useStreamedObject;
exports.useStreamedPlayer = useStreamedPlayer;
exports.useUI = useUI;
