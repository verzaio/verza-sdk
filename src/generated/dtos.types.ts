/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface TimeDto {
  timestamp: number;
}

export interface AuthDto {
  token?: string;
  use_cookies?: boolean;
  referral_code?: string;
}

export interface UserDto {
  id: string;
  username: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'staff' | 'admin';
  player_id: number | null;
  /** @format date-time */
  created_at: string;
  disabled: boolean;
}

export interface AuthResponseDto {
  user: UserDto;
  is_new: boolean;
  token?: string;
}

export interface CreateLoginLinkDto {
  email: string;
}

export interface CreateFileDto {
  /** @format binary */
  file: File;
}

export interface FileDto {
  id: string;
  name: string;
  mime: string;
  size: number;
  /** @format date-time */
  date: string;
  file_url: string;
  file_image_url: string;
}

export interface UpdateUserDto {
  /** @format binary */
  avatar?: File;
  /**
   * @minLength 2
   * @maxLength 32
   */
  username?: string;
  /**
   * @minLength 2
   * @maxLength 64
   */
  first_name?: string;
  /**
   * @minLength 2
   * @maxLength 64
   */
  last_name?: string;
  /** @maxLength 254 */
  email?: string;
  disabled?: boolean;
  role?: 'user' | 'staff' | 'admin';
}

export interface UserFiltersDto {
  role?: 'user' | 'staff' | 'admin';
  /** @maxLength 64 */
  search?: string;
  sort_by?: 'first_name' | 'username' | 'email' | 'created_at' | 'verified' | 'referrals_count';
  order?: 'ASC' | 'DESC';
}

export interface LogFiltersDto {
  /** @maxLength 64 */
  search?: string;
  /** @maxLength 64 */
  match_search?: string;
}

export interface UserProfileDto {
  id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  player_id: number | null;
}

export interface LogDto {
  id: string;
  user: UserProfileDto;
  identifier: string;
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  url: string;
  status_code: number;
  ip: string;
  headers: object;
  request_body: object;
  response_body: object;
  request_query_params: object;
  type: 'http' | 'other';
  /** @format date-time */
  created_at: string;
}

export interface NotificationsStatusDto {
  unseen_count: number;
}

export interface NotificationDto {
  id: string;
  message: string;
  url: string;
  seen: boolean;
  status: 'pending' | 'processed';
  /** @format date-time */
  created_at: string;
}

export interface NotificationEventDto {
  status?: NotificationsStatusDto;
  notification?: NotificationDto;
  event: 'status' | 'new_notification';
}

export interface CharacterShapekeyDto {
  id: string;
  name: string;
  min: number;
  max: number;
  nonEditable?: boolean;
}

export interface CharacterConfigDto {
  shapekeys: CharacterShapekeyDto[];
  eyes_colors: string[];
  skin_colors: string[];
  lipstick_colors: string[];
  blush_colors: string[];
  eyeshadow_colors: string[];
  eyeliner_colors: string[];
}

export interface CharacterShapekeyValueDto {
  name:
    | 'asian'
    | 'black'
    | 'caucasian'
    | 'e_blink_left'
    | 'e_blink_right'
    | '{cheeks}_cheek_fullness'
    | '{chin}_chin_dimple'
    | '{chin}_chin_height'
    | '{chin}_chin_size'
    | '{chin}_chin_width'
    | '{ears}_ear_height'
    | '{ears}_ear_lobe_size'
    | '{ears}_ear_turn'
    | '{ears}_ear_width'
    | '{eyes}_eye_tilt'
    | '{eyes}_eyelid_fat_pad'
    | '{eyes}_eyelid_rotation'
    | '{jaw}_jaw_location_horizontal'
    | '{jaw}_jaw_location_vertical'
    | '{jaw}_jaw_width'
    | '{nose}_nose_angle'
    | '{nose}_nose_bridge_height'
    | '{nose}_nose_bridge_width'
    | '{nose}_nose_height'
    | '{nose}_nose_location'
    | '{nose}_nose_nostril_flare'
    | '{nose}_nose_nostril_turn'
    | '{nose}_nose_tip_angle'
    | '{nose}_nose_tip_length'
    | '{nose}_nose_tip_size'
    | '{nose}_nose_tip_width'
    | '{mouth}_lip_width'
    | '{mouth}_lip_location'
    | '{mouth}_lip_cupid_bow'
    | '{mouth}_lip_offset'
    | '{mouth}_lip_height';
  /**
   * @min -1
   * @max 1
   */
  value: number;
}

export interface CharacterDto {
  id: string;
  user: UserProfileDto;
  gender: 'male' | 'female';
  shapekeys: CharacterShapekeyValueDto[];
  skin_color: string | null;
  eyes_color: string | null;
  lipstick_color: string | null;
  blush_color: string | null;
  eyeshadow_color: string | null;
  eyeliner_color: string | null;
  status: 'active' | 'deleted';
  /** @format date-time */
  created_at: string;
}

export interface CreateCharacterDto {
  gender: 'male' | 'female';
}

export interface UpdateCharacterDto {
  gender?: 'male' | 'female';
  shapekeys?: CharacterShapekeyValueDto[];
  eyes_color?:
    | '#ffffff'
    | '#d3520d'
    | '#a53d07'
    | '#8e3200'
    | '#7eba8b'
    | '#41ba5b'
    | '#1a9935'
    | '#039623'
    | '#2f857d'
    | '#4eb6ac'
    | '#7db3c7'
    | '#509dba'
    | '#177b9f'
    | '#ff9b2d'
    | '#ffbb2e'
    | '#e0afaf'
    | '#aca4a4';
  skin_color?:
    | '#fee0e0'
    | '#ffd9d9'
    | '#f8cdcd'
    | '#dbb6b6'
    | '#be9e9e'
    | '#ad9090'
    | '#9a8080'
    | '#866f6f'
    | '#826a6a';
  lipstick_color?:
    | '#ffaeae'
    | '#ff9c9c'
    | '#c87e7e'
    | '#c96969'
    | '#ff5353'
    | '#ff2525'
    | '#c20000'
    | '#930202'
    | '#f97504'
    | '#d16201'
    | '#9d4900'
    | '#05ff4c'
    | '#00c739'
    | '#00962b'
    | '#de96ff'
    | '#cf00ca'
    | '#ff28c1'
    | '#054dff'
    | '#170c00'
    | null;
  blush_color?:
    | '#FFFFFF'
    | '#fee0e0'
    | '#ffd9d9'
    | '#f8cdcd'
    | '#dbb6b6'
    | '#be9e9e'
    | '#ad9090'
    | '#9a8080'
    | '#866f6f'
    | '#826a6a'
    | '#ff0000'
    | '#ff00c2'
    | '#fd8656'
    | null;
  eyeshadow_color?:
    | '#000000'
    | '#505050'
    | '#a5a5a5'
    | '#e7e7e7'
    | '#615050'
    | '#3d3232'
    | '#d08383'
    | '#712222'
    | '#d6ab8b'
    | '#a1e499'
    | '#20fa62'
    | '#7ac0bb'
    | '#20faed'
    | '#7899b6'
    | '#0089fe'
    | '#7e77b5'
    | '#8f80fe'
    | '#a000fe'
    | '#fe00e2'
    | '#b976b1'
    | '#d0b07e'
    | null;
  eyeliner_color?:
    | '#000000'
    | '#505050'
    | '#a5a5a5'
    | '#e7e7e7'
    | '#615050'
    | '#3d3232'
    | '#d08383'
    | '#712222'
    | '#d6ab8b'
    | '#a1e499'
    | '#20fa62'
    | '#7ac0bb'
    | '#20faed'
    | '#7899b6'
    | '#0089fe'
    | '#7e77b5'
    | '#8f80fe'
    | '#a000fe'
    | '#fe00e2'
    | '#b976b1'
    | '#d0b07e'
    | null;
}

export interface ChatPacketSendDto {
  /**
   * message
   * @minLength 1
   * @maxLength 1024
   */
  m: string;
  /** player id (exclusive for servers) */
  p?: number;
}

export interface CustomPacketSendDto {
  /**
   * destination | PacketDestination
   * @min 0
   * @max 1
   */
  p: number;
  /**
   * event name
   * @minLength 1
   * @maxLength 256
   */
  e: string;
  /** data */
  d?: object;
  /** to player id */
  i?: number;
}

export interface JoinPacketDto {
  /** server id */
  s: string;
}

export interface EncryptedPacketsDto {
  auth: string;
}

export interface StatePacketDto {
  /** packet id */
  t: number;
  /** code */
  c?: number;
  /** error */
  e?: string;
  /** encrypted packets */
  p?: EncryptedPacketsDto;
}

export interface PlayerPacketDto {
  /** packet id */
  t: number;
  /** id */
  i?: number;
  /** entity action */
  a: number;
  /** state animation */
  n?: number;
  /** name */
  e?: string;
  /** character */
  c?: CharacterDto;
  /** player state */
  s?: number;
  /** position | Vector3Array */
  p?: number[];
  /** rotation | QuaternionArray */
  r?: number[];
  /** head | Vector3Array */
  h?: number[];
  /** velocity | Vector3Array */
  v?: number[];
}

export interface PlayerPacketUpdateDto {
  /**
   * state animation
   * @min 0
   * @max 100000
   */
  n?: number;
  /**
   * player state
   * @min 0
   * @max 5
   */
  s?: number;
  /** position | Vector3Array */
  p?: number[];
  /** rotation | QuaternionArray */
  r?: number[];
  /** head | Vector3Array */
  h?: number[];
  /** velocity | Vector3Array */
  v?: number[];
}

export interface PositionMetadataDto {
  /** rotation | QuaternionArray */
  rotation?: number[];
}

export interface BasicPositionDto {
  /** position | WorldPosition */
  p: number[];
  /** metadata */
  m?: PositionMetadataDto;
}

export interface ObjectGroupDto {
  c?: ObjectDto[];
}

export interface ObjectModelDto {
  /**
   * model id
   * @maxLength 64
   */
  m: string;
  /** data */
  d?: object;
}

export interface ObjectBoxDto {
  /**
   * width
   * @min 0
   * @max 50
   */
  w: number;
  /**
   * height
   * @min 0
   * @max 50
   */
  h: number;
  /**
   * depth
   * @min 0
   * @max 50
   */
  d: number;
  /**
   * widthSegments
   * @min 0
   * @max 50
   */
  ws?: number;
  /**
   * widthSegments
   * @min 0
   * @max 50
   */
  hs?: number;
  /**
   * depthsegments
   * @min 0
   * @max 50
   */
  ds?: number;
  /** color */
  c?: string;
}

export interface ObjectGltfDto {
  /** resource url */
  u: string;
}

export interface ObjectLinePointDto {
  /** point | Vector3Array */
  p: number[];
}

export interface ObjectLineDto {
  /** points | ObjectLinePointDto[] */
  p: ObjectLinePointDto[];
  /** color */
  c?: string;
}

export interface ObjectMetadataDto {
  /** collision */
  p?: 'static' | 'kinematic' | 'dynamic';
  /** draw distance */
  d?: 'low' | 'mid' | 'high';
  /**
   * scale
   * @min 0.1
   * @max 100
   */
  s?: number;
  /** shadows */
  ss?: boolean;
  /** group */
  group?: ObjectGroupDto;
  /** model */
  model?: ObjectModelDto;
  /** box */
  box?: ObjectBoxDto;
  /** gltf */
  gltf?: ObjectGltfDto;
  /** gltf */
  line?: ObjectLineDto;
}

export interface ObjectDto {
  /** object id */
  id: string;
  /** type */
  t: 'group' | 'model' | 'gltf' | 'box' | 'line';
  /** position */
  p?: BasicPositionDto;
  /** source */
  s?: 'hosted' | 'external';
  /** metadata */
  m?: ObjectMetadataDto;
}

export interface ChunkDto {
  index: string;
  chunk_size: number;
  objects: ObjectDto[];
}

export interface ChunkPacketDto {
  /** packet id */
  t: number;
  /** data */
  d: ChunkDto;
}

export interface ChunksDummyFiltersDto {
  collision?: 'static' | 'kinematic' | 'dynamic';
  draw_distance?: 'low' | 'mid' | 'high';
  shadows?: boolean;
}

export interface ChunkPacketRequestDto {
  /** world id */
  w: string;
  /** chunk index */
  i: string;
  /** is dummy */
  d?: boolean;
  /** filters */
  f?: ChunksDummyFiltersDto;
}

export interface ChatPacketDto {
  /** packet id */
  t: number;
  /** message */
  m: string;
}

export interface VoicePacketDto {
  /** packet id */
  t: number;
  /** player id */
  p: number;
  /** timestamp */
  s: number;
  /** type */
  e: 'delta' | 'key';
  /** data */
  d: object;
}

export interface VoicePacketSendDto {
  /**
   * timestamp
   * @min 0
   */
  s: number;
  /** type */
  e: 'delta' | 'key';
  /** data */
  d: object;
  /** replay to myself (dev) */
  r?: boolean;
}

export interface BasicWorldDto {
  id: string;
  name: string;
  map_size: number;
  chunk_size: number;
}

export interface ScriptDto {
  url: string;
  name?: string;
  disabled?: boolean;
  settings?: object;
}

export interface ServerPermissionsDto {
  can_manage: boolean;
  can_delete: boolean;
}

export interface ServerDto {
  id: string;
  name: string | null;
  status: 'active' | 'inactive';
  players_count: number;
  region: 'global';
  world: BasicWorldDto | null;
  scripts: ScriptDto[];
  permissions: ServerPermissionsDto;
  /** @format date-time */
  created_at: string;
}

export interface SyncPacketDto {
  /** packet id */
  t: number;
  /** server */
  server?: ServerDto;
  /** encrypted packets */
  packets?: EncryptedPacketsDto;
}

export interface SyncPacketSendDto {
  /** packets */
  packets: boolean;
}

export interface CustomPacketDto {
  /** packet id */
  t: number;
  /** player id (available only when source === PacketSource.Client) */
  p: number;
  /** packet source | PacketSource */
  s: number;
  /** event name */
  e: string;
  /** data */
  d?: object;
}

export interface PlayerIdDto {
  player_id: number;
}

export interface ServerFiltersDto {
  region?: 'global';
}

export interface CreateServerDto {
  region?: 'global';
  /**
   * @minLength 4
   * @maxLength 128
   */
  name: string;
}

export interface UpdateScriptDto {
  /**
   * @minLength 1
   * @maxLength 128
   */
  name?: string;
  url: string;
  disabled?: boolean;
  settings?: object;
}

export interface UpdateServerDto {
  /**
   * @minLength 4
   * @maxLength 128
   */
  name?: string;
  scripts?: UpdateScriptDto[];
}

export interface KeyDto {
  token: string;
}

export interface WorldDto {
  id: string;
  name: string;
  map_size: number;
  chunk_size: number;
  owner: UserProfileDto;
  creator: UserProfileDto;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface UpdateWorldDto {
  /**
   * @minLength 4
   * @maxLength 128
   */
  name?: string;
}

export interface PositionDto {
  id: string;
  x: number;
  y: number;
  z: number;
  dimension: number;
  chunk_index: string;
  world: WorldDto;
  metadata?: PositionMetadataDto;
}

export interface BaseObjectDto {
  id: string;
  type: 'group' | 'model' | 'gltf' | 'box' | 'line';
  position: PositionDto;
  source: 'hosted' | 'external' | null;
  metadata: ObjectMetadataDto;
  world: WorldDto;
  /** @format date-time */
  created_at: string;
}

export interface CreatePositionDto {
  /** position | Vector3Array */
  position: number[];
  /** position | QuaternionArray */
  rotation?: number[];
  dimension: number;
}

export interface CreateObjectDto {
  type: 'group' | 'model' | 'gltf' | 'box' | 'line';
  source?: 'hosted' | 'external';
  position: CreatePositionDto;
  metadata?: ObjectMetadataDto;
}

export interface UpdatePositionDto {
  /** position | Vector3Array */
  position: number[];
  /** position | QuaternionArray */
  rotation?: number[];
  dimension: number;
}
