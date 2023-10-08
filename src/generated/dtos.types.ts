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
  sort_by?: 'first_name' | 'username' | 'email' | 'created_at';
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

export interface CreateAssetDto {
  /** @format binary */
  asset_file: File;
  optimize_geometry?: boolean;
  optimize_textures?: boolean;
}

export interface AssetDto {
  id: string;
  asset_url: string;
  /** @format date-time */
  created_at: string;
}

export interface CharacterShapekeyValueDto {
  name:
    | 'caucasian'
    | 'black'
    | 'asian'
    | 'variation_1'
    | 'variation_2'
    | 'variation_3'
    | 'variation_4'
    | 'variation_5'
    | 'variation_6'
    | 'variation_7'
    | 'variation_8'
    | 'variation_9'
    | 'variation_10'
    | 'variation_11'
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
    | '{eyes}_eye_orbit_size'
    | '{eyes}_eyelid_fat_pad'
    | '{eyes}_eyelid_rotation'
    | '{eyes}_eyelid_shift_vertical'
    | '{eyes}_eyelid_shift_horizontal'
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
    | '{mouth}_lip_height'
    | '{u_skull}_browridge_loc_vertical'
    | '{l_skull}_muzzle_location_vertical'
    | '{l_skull}_muzzle_location_horizontal';
  /**
   * @min -2
   * @max 2
   */
  value: number;
}

export type Map = object;

export interface CharacterClotheDto {
  /** @maxLength 64 */
  id: string;
  color?: string;
  materialTextures?: Map;
  materialColors?: Map;
  maskColors?: Map;
  headMaskColors?: Map;
}

export interface CharacterDto {
  id: string;
  user: UserProfileDto;
  gender: 'male' | 'female';
  shapekeys: CharacterShapekeyValueDto[] | null;
  skin_index: number | null;
  eyes_color: string | null;
  lipstick_color: string | null;
  blush_color: string | null;
  foundation_color: string | null;
  eyeshadow_color: string | null;
  eyeliner_color: string | null;
  eyebrows_style: number | null;
  eyebrows_color: string | null;
  eyebrows_opacity: number | null;
  clothes: CharacterClotheDto[] | null;
  outfit: string | null;
  image_url: string | null;
  status: 'active' | 'deleted';
  selected: boolean;
  /** @format date-time */
  created_at: string;
}

export interface CreateCharacterDto {
  gender: 'male' | 'female';
  clothes?: CharacterClotheDto[];
  /** @maxLength 64 */
  outfit?: string;
}

export interface UpdateCharacterDto {
  /** @format binary */
  image?: File;
  selected?: boolean;
  gender?: 'male' | 'female';
  shapekeys?: CharacterShapekeyValueDto[];
  /**
   * @min 0
   * @max 9
   */
  skin_index?: number | null;
  eyes_color?: string | null;
  lipstick_color?: string | null;
  blush_color?: string | null;
  foundation_color?: string | null;
  eyeshadow_color?: string | null;
  eyeliner_color?: string | null;
  /**
   * @min 0
   * @max 6
   */
  eyebrows_style?: number | null;
  eyebrows_color?: string | null;
  /**
   * @min 0
   * @max 100
   */
  eyebrows_opacity?: number | null;
  clothes?: CharacterClotheDto[];
  /** @maxLength 64 */
  outfit?: string | null;
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
  content?: string;
  disabled?: boolean;
  settings?: object;
}

export interface RoleDto {
  id: string;
  name: string;
  admin: boolean;
  members_count: number;
  /** @format date-time */
  created_at: string;
}

export interface ServerPermissionsDto {
  can_manage: boolean;
  can_delete: boolean;
}

export interface CommandConfigDto {
  /** @maxLength 64 */
  command: string;
  roles: string[];
}

export interface ServerSettingsDto {
  chat_enabled?: boolean;
  voicechat_enabled?: boolean;
  voicechat_mode?: 'global' | 'proximity';
  voicechat_distance?: number;
  players_nametag_distance?: number | null;
  players_streamer_distance?: number | null;
}

export interface ServerDto {
  id: string;
  name: string | null;
  logo_url: string;
  players_count: number;
  region: 'global';
  world: BasicWorldDto | null;
  scripts: ScriptDto[];
  roles: RoleDto[];
  permissions: ServerPermissionsDto;
  status: 'active' | 'inactive';
  privacy_mode: 'public' | 'private' | 'unlisted';
  commands: CommandConfigDto[];
  settings: ServerSettingsDto;
  assets_url?: string;
  favorited: boolean;
  /** @format date-time */
  created_at: string;
}

export interface ScriptActionPacketSendDto {
  /**
   * event
   * @minLength 1
   * @maxLength 128
   */
  e: string;
  /** sync data */
  d?: object;
  /** player id */
  p?: number;
}

export interface JoinPacketDto {
  /** server id */
  s: string;
  /** token */
  t: string;
  /** password */
  p?: string;
}

export interface EncryptedPacketsDto {
  auth?: string;
  commands?: object;
}

export interface StatePacketDto {
  /** packet id */
  t: number;
  /** instance id */
  i: string;
  /** code */
  c?: number;
  /** error code or message */
  e?: string;
  /** message */
  m?: string;
  /** secondary message */
  s?: string;
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
  /** surfing */
  f?: number;
  /** position | Vector3Array */
  p?: number[];
  /** rotation | QuaternionArray */
  r?: number[];
  /** head | Vector3Array */
  h?: number[];
  /** velocity | Vector3Array */
  v?: number[];
  /** dimension */
  d?: number;
  /** roles */
  l?: string[];
  /** voicechat mode */
  m?: number | null;
  /** voicechat distance */
  k?: number | null;
}

export interface PlayerPacketUpdateDto {
  /**
   * state animation
   * @min 0
   * @max 1000000000
   */
  n?: number;
  /**
   * player state
   * @min 0
   * @max 5
   */
  s?: number;
  /**
   * player surfing
   * @min 0
   * @max 1
   */
  f?: number;
  /** position | Vector3Array */
  p?: number[];
  /** rotation | QuaternionArray */
  r?: number[];
  /** head | Euler3Array */
  h?: number[];
  /** velocity | Vector3Array */
  v?: number[];
}

export interface PlayerPacketLocalUpdateDto {
  /**
   * state animation
   * @min 0
   * @max 1000000000
   */
  n?: number;
  /**
   * player state
   * @min 0
   * @max 5
   */
  s?: number;
  /**
   * player surfing
   * @min 0
   * @max 1
   */
  f?: number;
  /** position | Vector3Array */
  p?: number[];
  /** rotation | QuaternionArray */
  r?: number[];
  /** head | Euler3Array */
  h?: number[];
  /** velocity | Vector3Array */
  v?: number[];
  /** dimension */
  d?: number;
  /** name */
  e?: string;
  /** character */
  c?: CharacterDto;
  /** roles */
  l?: string[];
  /** voicechat mode */
  m?: number | null;
  /** voicechat distance */
  k?: number | null;
}

export interface ObjectDataDto {
  /** type | ObjectType */
  t: string;
  /** object data */
  o: object;
  /** position | Vector3Array */
  p?: number[];
  /** rotation | QuaternionArray */
  r?: number[];
  /** scale | Vector3Array */
  s?: number[];
  /** dimension */
  d?: number;
  /** collision | EntityCollision */
  c?: string | null;
  /** collider | EntityCollider */
  cc?: string | null;
  /** collision sensor */
  cs?: boolean;
  /** mass */
  m?: number;
  /** draw distance | EntityDrawDistance */
  dd?: string;
  /** shadows */
  ss?: boolean;
  /** permanent object */
  po?: boolean;
  /** render order */
  ro?: number;
  /** remote object */
  rm?: boolean;
}

export interface ObjectDto {
  /** object id */
  id: string;
  /** data */
  d: ObjectDataDto;
}

export interface ChunkDto {
  i: string;
  o: ObjectDto[];
}

export interface ChunkPacketDto {
  /** packet id */
  t: number;
  /** data */
  d: ChunkDto;
}

export interface ChunksDummyFiltersDto {
  collision?: 'static' | 'kinematicPosition' | 'kinematicVelocity' | 'dynamic';
  draw_distance?: 'low' | 'mid' | 'high';
  shadows?: boolean;
}

export interface ChunkPacketRequestDto {
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

export interface ChatPacketSendDto {
  /**
   * message
   * @minLength 1
   * @maxLength 1024
   */
  m: string;
}

export interface VoicePacketDto {
  /** packet id */
  t: number;
  /** player id */
  p: number;
  /** data */
  d: object;
  /** timestamp */
  s: number;
}

export interface VoicePacketSendDto {
  /**
   * timestamp
   * @min 0
   */
  s: number;
  /** data */
  d: object;
  /** replay to myself (dev) */
  r?: boolean;
}

export interface SyncPacketDto {
  /** packet id */
  t: number;
  /** server */
  server?: ServerDto;
  /** encrypted packets */
  packets?: EncryptedPacketsDto;
  /** voicechatMute */
  voicechatMute?: boolean;
}

export interface SyncPacketSendDto {
  /** packets */
  packets: boolean;
}

export interface ScriptSyncPacketDto {
  /** packet id */
  t: number;
  /** sync data */
  d: object[];
}

export interface ScriptActionPacketDto {
  /** packet id */
  t: number;
  /**
   * event
   * @minLength 1
   * @maxLength 128
   */
  e: string;
  /** sync data */
  d: object;
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
  /** roles */
  r?: string[];
  /** command */
  c?: string;
}

export interface PlayerIdDto {
  player_id: number;
}

export interface ServerFiltersDto {
  /** @maxLength 128 */
  name?: string;
  /**
   * @IsEnum(NetworkRegion)
   *   region: NetworkRegion;
   */
  favorites?: boolean;
}

export interface ServerConnectionDto {
  token: string | null;
}

export interface ValidateServerConnectionDto {
  token: string;
}

export interface ServerPlayerDto {
  id: number;
  name: string;
  position: number[];
}

export interface ServerStatusDto {
  id: string;
  name: string | null;
  logo_url: string;
  players_count: number;
  region: 'global';
  world: BasicWorldDto | null;
  scripts: ScriptDto[];
  roles: RoleDto[];
  permissions: ServerPermissionsDto;
  status: 'active' | 'inactive';
  privacy_mode: 'public' | 'private' | 'unlisted';
  commands: CommandConfigDto[];
  settings: ServerSettingsDto;
  assets_url?: string;
  favorited: boolean;
  /** @format date-time */
  created_at: string;
  instance_id?: string;
  players?: ServerPlayerDto[];
}

export interface CreateServerDto {
  region?: 'global';
  /**
   * @minLength 4
   * @maxLength 128
   */
  name: string;
  privacy_mode: 'public' | 'private' | 'unlisted';
}

export interface ServerPasswordDto {
  password: string;
}

export interface UpdateScriptDto {
  /**
   * @minLength 1
   * @maxLength 128
   */
  name?: string;
  url: string;
  content?: string;
  disabled?: boolean;
  settings?: object;
}

export interface UpdateServerDto {
  /** @format binary */
  logo?: File;
  /**
   * @minLength 4
   * @maxLength 128
   */
  name?: string;
  privacy_mode?: 'public' | 'private' | 'unlisted';
  scripts?: UpdateScriptDto[];
  commands?: CommandConfigDto[];
}

export interface KeyDto {
  token: string;
}

export interface MemberFiltersDto {
  /** @maxLength 64 */
  search?: string;
  banned?: boolean;
}

export interface MemberDto {
  id: string;
  user: UserProfileDto;
  roles: RoleDto[];
  banned: boolean;
  /** @format date-time */
  ban_expiration: string | null;
  ban_reason: string | null;
  /** @format date-time */
  joined_at: string;
  /** @format date-time */
  last_seen_at: string;
}

export interface UserRoleFiltersDto {
  /** @maxLength 64 */
  search?: string;
}

export interface UserRoleDto {
  id: string;
  user: UserProfileDto;
  role: RoleDto;
}

export interface RoleFiltersDto {
  /** @maxLength 64 */
  search?: string;
}

export interface CreateRoleDto {
  /** @maxLength 64 */
  name: string;
  admin?: boolean;
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

export interface PositionMetadataDto {
  /** rotation | QuaternionArray */
  rotation?: number[];
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
  type: string;
  position: PositionDto;
  data: ObjectDataDto;
  world: WorldDto;
  /** @format date-time */
  created_at: string;
}
