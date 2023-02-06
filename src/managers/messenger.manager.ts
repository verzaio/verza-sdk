import {
  MessengerManagerEventsMap,
  MessengerMessage,
  MessengerValidators,
} from 'engine/definitions/types/messenger.types';

import EventsManager, {EventListenersMap} from './events.manager';

type MessengerType = 'sender' | 'receiver';

type Merge<A, B> = A extends void ? B : A & B;

type MessengerManagerMap = {
  onConnected: () => void;

  onLoad: () => void;

  register: (event: string) => void;

  unregister: (event: string) => void;
};

const TYPE_HANDSHAKE_CONNECTION = 'HANDSHAKE_CONNECTION';

const ACTION_CONNECT = 'REQUEST';

const ACTION_ACCEPT = 'ACCEPT';

class MessengerManager<Events extends EventListenersMap = EventListenersMap> {
  id: string = null!;

  type: MessengerType;

  channel: MessageChannel = null!;

  port: MessagePort = null!;

  validators: MessengerValidators<Events> = null!;

  events: MessengerEvents<
    Merge<MessengerManagerMap, MessengerManagerEventsMap<Events>>
  >;

  connected = false;

  constructor(type: MessengerType, id?: string) {
    this.type = type;

    this.events = new MessengerEvents(this as any);

    // abort if window not present
    if (typeof window === 'undefined') return;

    // set id
    this.id = id ?? window.name;

    // bind handshake listener
    this._bindHandshakeListener();
  }

  setValidators(validators: MessengerValidators<Events>) {
    this.validators = validators;
  }

  connect(windowToConnect: Window) {
    if (this.type !== 'sender') {
      console.log(`[messenger:${this.type}] only senders can connect`);
      return;
    }

    // create message channel if sender
    if (this.type === 'sender') {
      this.channel = new MessageChannel();
      this.port = this.channel.port1;
      this.port.onmessage = this._onMessage;
    }

    // send connect message
    windowToConnect.postMessage(
      {
        id: this.id,
        type: TYPE_HANDSHAKE_CONNECTION,
        action: ACTION_CONNECT,
      },
      '*',
      [this.channel.port2],
    );
  }

  accept(port: MessagePort) {
    if (this.type !== 'receiver') {
      console.log(`[messenger:${this.type}] only receivers can accept`);
      return;
    }

    // disconnect port
    this._disconnectPort();

    // set port
    this.port = port;
    this.port.onmessage = this._onMessage;

    // emit accept
    this.port.postMessage({
      id: this.id,
      type: TYPE_HANDSHAKE_CONNECTION,
      action: ACTION_ACCEPT,
    });
  }

  private _disconnectPort() {
    if (!this.port) return;

    this.port.onmessage = null!;
    this.port.close();
    this.port = null!;
  }

  disconnect() {
    // unbind
    this._unbindHandshakeListener();

    // disconnect
    this._disconnectPort();

    // remove channel
    if (this.channel) {
      this.channel = null!;
    }

    this.connected = false;
  }

  private _bindHandshakeListener() {
    this._unbindHandshakeListener();
    window.addEventListener('message', this._onHandshake);
  }

  private _unbindHandshakeListener() {
    window.removeEventListener('message', this._onHandshake);
  }

  private _onHandshake = (message: MessengerMessage) => {
    if (message.data?.type !== TYPE_HANDSHAKE_CONNECTION) return;

    //console.log(`_onHandshake:${this.type}`, message.data);

    if (message.data?.id !== this.id) {
      if (this.type !== 'receiver') {
        console.debug(
          `[messenger:${this.type}] sender id mismatch "${this.id}" != "${message.data?.id}"`,
        );
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

    // receiver
    if (this.type === 'receiver' && message.data.action === ACTION_CONNECT) {
      console.debug(`ACTION_CONNECT:${this.id.split('-')[0]}`);

      if (!message.ports.length) {
        console.log(`[messenger:${this.type}] port is missing`);
        return;
      }

      // accept
      this.accept(message.ports[0]);

      // emit connected
      (this.events.emit as any)('onConnected');

      this._onConnected();
      return;
    }

    // sender
    if (this.type === 'sender' && message.data.action === ACTION_ACCEPT) {
      console.debug(`ACTION_ACCEPT:${this.id.split('-')[0]}`);

      // emit connected
      (this.events.emit as any)('onConnected');

      this._onConnected();
      return;
    }

    console.debug(`[messenger:${this.type}] unhandled request`);
  };

  private _onConnected() {
    this.connected = true;

    this.events.emitRegisteredEvents();

    this.emit('onLoad');
  }

  private _onMessage = (message: MessengerMessage) => {
    // handle handshake
    if (message.data?.type === TYPE_HANDSHAKE_CONNECTION) {
      this._onHandshake(message);
      return;
    }

    if (Array.isArray(message.data) === false || !message.data.length) {
      console.debug(`[messenger:${message.data}] must be an array`);
      return;
    }

    //console.debug(`[messenger:${message.data}] _onMessage`, message.data);

    // get event name
    const event = message.data.pop();

    // validate
    if (this.validators?.[event]) {
      try {
        const {parser, callback} = this.validators[event] ?? {};

        if (parser) {
          Object.assign(message.data, parser.parse(message.data));
        }

        // call callback if exists
        callback?.(message);
      } catch (e) {
        console.error(e);
        return;
      }
    }

    // handle registration
    if (event === 'register') {
      this.events.registeredEvents.add(message.data[0]);
      return;
    } else if (event === 'unregister') {
      this.events.registeredEvents.delete(message.data[0]);
      return;
    }

    (this.events.emit as any)(event, message);
  };

  canEmit<A extends keyof Events>(eventName: A) {
    return this.events.registeredEvents.has(eventName);
  }

  async emitLocal<A extends keyof Events>(
    eventName: A,
    args?: Parameters<Events[A]>,
  ) {
    this._onMessage({
      data: args ? [...args, eventName] : [eventName],
    } as MessengerMessage);
  }

  async emit<A extends keyof Events>(
    eventName: A,
    args?: Parameters<Events[A]>,
    transfer?: Array<Transferable | OffscreenCanvas>,
  ) {
    if (!this.port) return;

    if (this.type !== 'sender' && !this.canEmit(eventName)) {
      //console.log('not emitting, not registered!', eventName, this.type);
      return;
    }

    if (transfer) {
      this.port.postMessage(
        args ? [...args, eventName] : [eventName],
        transfer,
      );
      return;
    }

    this.port.postMessage(args ? [...args, eventName] : [eventName]);
  }

  destroy() {
    this.disconnect();

    this.events.removeAllListeners();
  }
}

class MessengerEvents<
  T extends EventListenersMap = EventListenersMap,
> extends EventsManager<T> {
  registerEvents = false;

  registeredEvents = new Set<keyof T>();

  private _messenger: MessengerManager;

  constructor(messenger: MessengerManager) {
    super();

    this._messenger = messenger;
  }

  on<A extends keyof T>(eventName: A, listener: T[A]): T[A] {
    // try to register
    this._register(eventName);

    return super.on(eventName, listener);
  }

  off<A extends keyof T>(eventName: A, listener: T[A]) {
    super.off(eventName, listener);

    // try to unregister
    this._unregister(eventName);
  }

  once<A extends keyof T>(eventName: A, listener: T[A]): T[A] {
    console.debug('[MessengerEvents] events.once not available');
    return listener;
  }

  removeAllListeners(): void {
    super.removeAllListeners();

    // unregister all events
    this.registeredEvents.forEach(event => this._unregister(event));
  }

  private _register<A extends keyof T>(eventName: A) {
    if (this.registerEvents && !this.registeredEvents.has(eventName)) {
      this.registeredEvents.add(eventName);

      // emit
      if (this._messenger.connected) {
        this._messenger.emit('register', [eventName]);
      }
    }
  }

  private _unregister<A extends keyof T>(eventName: A) {
    if (
      this.registerEvents &&
      this.getEmitter().listenerCount(eventName as string) === 0
    ) {
      this.registeredEvents.delete(eventName);

      // emit
      if (this._messenger.connected) {
        this._messenger.emit('unregister', [eventName]);
      }
    }
  }

  emitRegisteredEvents() {
    if (!this.registerEvents) return;

    //console.log(this.registeredEvents);

    this.registeredEvents.forEach(eventName => {
      this._messenger.emit('register', [eventName]);
    });
  }
}

export default MessengerManager;
