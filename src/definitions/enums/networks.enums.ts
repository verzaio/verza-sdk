export enum PacketEvent {
  /* player connection */
  Join = 'j', // join
  Quit = 'q', // quit

  Update = 'u', // player or entity update

  Chunk = 'c', // chunk

  Voice = 'v', // voice

  Chat = 'h', // chat
}

export enum EntityPacketAction {
  c = 0, // create

  d = 1, // destroy

  a = 2, // add

  r = 3, // remove

  u = 4, // update
}

export enum PacketId {
  unknown = 0, // unknown

  p = 1, // player

  s = 2, // state

  c = 3, // chunk

  v = 4, // voice

  h = 5, // chat
}

export enum StateCodeId {
  ConnectionAccepted = 0,
}
