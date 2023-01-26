import EventsManager, {EventListenersMap} from './events.manager';

type MessengerType = 'sender' | 'receiver';

type Merge<A, B> = A extends void ? B : A & B;

type MessengerManagerMap = {
  onConnected: () => void;
};

export type MessengerManagerEventsMap<T extends EventListenersMap> = {
  [key in keyof T]: (message: MessageEvent<Parameters<T[key]>>) => void;
};

export type MessengerValidators<T extends EventListenersMap> = Partial<{
  [key in keyof T]: {
    parse: (params: unknown) => any;
  };
}>;

const TYPE_HANDSHAKE_CONNECTION = 'HANDSHAKE_CONNECTION';

const ACTION_CONNECT = 'REQUEST';

const ACTION_ACCEPT = 'ACCEPT';

class MessengerManager<Events extends EventListenersMap = EventListenersMap> {
  id: string = null!;

  type: MessengerType;

  channel: MessageChannel = null!;

  port: MessagePort = null!;

  validators: MessengerValidators<Events> = null!;

  events = new EventsManager<
    Merge<MessengerManagerMap, MessengerManagerEventsMap<Events>>
  >();

  constructor(type: MessengerType, id?: string) {
    this.type = type;

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
    //
    //
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
  }

  private _bindHandshakeListener() {
    this._unbindHandshakeListener();
    window.addEventListener('message', this._onHandshake);
  }

  private _unbindHandshakeListener() {
    window.removeEventListener('message', this._onHandshake);
  }

  private _onHandshake = (message: MessageEvent) => {
    if (message.data?.type !== TYPE_HANDSHAKE_CONNECTION) return;

    //console.log(`_onHandshake:${this.type}`, message.data);

    if (message.data?.id !== this.id) {
      console.debug(
        `[messenger:${this.type}] sender id mismatch "${this.id}" != "${message.data?.id}"`,
      );
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
      return;
    }

    // sender
    if (this.type === 'sender' && message.data.action === ACTION_ACCEPT) {
      console.debug(`ACTION_ACCEPT:${this.id.split('-')[0]}`);

      // emit connected
      (this.events.emit as any)('onConnected');
      return;
    }

    console.debug(`[messenger:${this.type}] unhandled request`);
  };

  private _onMessage = (message: MessageEvent) => {
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
    if (this.validators[event]) {
      try {
        Object.assign(
          message.data,
          this.validators[event]?.parse(message.data),
        );
      } catch (e) {
        console.error(e);
        return;
      }
    }

    (this.events.emit as any)(event, message);
  };

  emit<A extends keyof Events>(
    eventName: A,
    args?: Parameters<Events[A]>,
    transfer?: Array<Transferable | OffscreenCanvas>,
  ) {
    if (!this.port) return;

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

export default MessengerManager;
