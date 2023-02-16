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
    file: File;
}
export interface FileDto {
    id: string;
    name: string;
    mime: string;
    size: number;
    date: string;
    file_url: string;
    file_image_url: string;
}
export interface UpdateUserDto {
    avatar?: File;
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    disabled?: boolean;
    role?: 'user' | 'staff' | 'admin';
}
export interface UserFiltersDto {
    role?: 'user' | 'staff' | 'admin';
    search?: string;
    sort_by?: 'first_name' | 'username' | 'email' | 'created_at';
    order?: 'ASC' | 'DESC';
}
export interface LogFiltersDto {
    search?: string;
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
    name: 'asian' | 'black' | 'caucasian' | 'e_blink_left' | 'e_blink_right' | '{cheeks}_cheek_fullness' | '{chin}_chin_dimple' | '{chin}_chin_height' | '{chin}_chin_size' | '{chin}_chin_width' | '{ears}_ear_height' | '{ears}_ear_lobe_size' | '{ears}_ear_turn' | '{ears}_ear_width' | '{eyes}_eye_tilt' | '{eyes}_eyelid_fat_pad' | '{eyes}_eyelid_rotation' | '{jaw}_jaw_location_horizontal' | '{jaw}_jaw_location_vertical' | '{jaw}_jaw_width' | '{nose}_nose_angle' | '{nose}_nose_bridge_height' | '{nose}_nose_bridge_width' | '{nose}_nose_height' | '{nose}_nose_location' | '{nose}_nose_nostril_flare' | '{nose}_nose_nostril_turn' | '{nose}_nose_tip_angle' | '{nose}_nose_tip_length' | '{nose}_nose_tip_size' | '{nose}_nose_tip_width' | '{mouth}_lip_width' | '{mouth}_lip_location' | '{mouth}_lip_cupid_bow' | '{mouth}_lip_offset' | '{mouth}_lip_height';
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
    selected: boolean;
    created_at: string;
}
export interface CreateCharacterDto {
    gender: 'male' | 'female';
}
export interface UpdateCharacterDto {
    selected?: boolean;
    gender?: 'male' | 'female';
    shapekeys?: CharacterShapekeyValueDto[];
    eyes_color?: '#ffffff' | '#d3520d' | '#a53d07' | '#8e3200' | '#7eba8b' | '#41ba5b' | '#1a9935' | '#039623' | '#2f857d' | '#4eb6ac' | '#7db3c7' | '#509dba' | '#177b9f' | '#ff9b2d' | '#ffbb2e' | '#e0afaf' | '#aca4a4' | null;
    skin_color?: '#fee0e0' | '#ffd9d9' | '#f8cdcd' | '#dbb6b6' | '#be9e9e' | '#ad9090' | '#9a8080' | '#866f6f' | '#826a6a' | null;
    lipstick_color?: '#ffaeae' | '#ff9c9c' | '#c87e7e' | '#c96969' | '#ff5353' | '#ff2525' | '#c20000' | '#930202' | '#f97504' | '#d16201' | '#9d4900' | '#05ff4c' | '#00c739' | '#00962b' | '#de96ff' | '#cf00ca' | '#ff28c1' | '#054dff' | '#170c00' | null;
    blush_color?: '#FFFFFF' | '#fee0e0' | '#ffd9d9' | '#f8cdcd' | '#dbb6b6' | '#be9e9e' | '#ad9090' | '#9a8080' | '#866f6f' | '#826a6a' | '#ff0000' | '#ff00c2' | '#fd8656' | null;
    eyeshadow_color?: '#000000' | '#505050' | '#a5a5a5' | '#e7e7e7' | '#615050' | '#3d3232' | '#d08383' | '#712222' | '#d6ab8b' | '#a1e499' | '#20fa62' | '#7ac0bb' | '#20faed' | '#7899b6' | '#0089fe' | '#7e77b5' | '#8f80fe' | '#a000fe' | '#fe00e2' | '#b976b1' | '#d0b07e' | null;
    eyeliner_color?: '#000000' | '#505050' | '#a5a5a5' | '#e7e7e7' | '#615050' | '#3d3232' | '#d08383' | '#712222' | '#d6ab8b' | '#a1e499' | '#20fa62' | '#7ac0bb' | '#20faed' | '#7899b6' | '#0089fe' | '#7e77b5' | '#8f80fe' | '#a000fe' | '#fe00e2' | '#b976b1' | '#d0b07e' | null;
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
export interface RoleDto {
    id: string;
    name: string;
    admin: boolean;
    members_count: number;
    created_at: string;
}
export interface ServerPermissionsDto {
    can_manage: boolean;
    can_delete: boolean;
}
export interface CommandConfigDto {
    command: string;
    roles: string[];
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
    commands: CommandConfigDto[];
    favorited: boolean;
    created_at: string;
}
export interface ScriptActionPacketSendDto {
    e: string;
    d: object;
}
export interface JoinPacketDto {
    s: string;
}
export interface EncryptedPacketsDto {
    auth?: string;
    commands?: object;
}
export interface StatePacketDto {
    t: number;
    c?: number;
    e?: string;
    m?: string;
    p?: EncryptedPacketsDto;
}
export interface PlayerPacketDto {
    t: number;
    i?: number;
    a: number;
    n?: number;
    e?: string;
    c?: CharacterDto;
    s?: number;
    p?: number[];
    r?: number[];
    h?: number[];
    v?: number[];
    d?: number;
    l?: string[];
}
export interface PlayerPacketUpdateDto {
    n?: number;
    s?: number;
    p?: number[];
    r?: number[];
    h?: number[];
    v?: number[];
}
export interface PlayerPacketLocalUpdateDto {
    n?: number;
    s?: number;
    p?: number[];
    r?: number[];
    h?: number[];
    v?: number[];
    d?: number;
    e?: string;
    c?: CharacterDto;
    l?: string[];
}
export interface PositionMetadataDto {
    rotation?: number[];
}
export interface BasicPositionDto {
    p: number[];
    m?: PositionMetadataDto;
}
export interface ObjectGroupDto {
    c?: ObjectDto[];
}
export interface ObjectModelDto {
    m: string;
    d?: object;
}
export interface ObjectBoxDto {
    w: number;
    h: number;
    d: number;
    ws?: number;
    hs?: number;
    ds?: number;
    c?: string;
}
export interface ObjectGltfDto {
    u: string;
}
export interface ObjectLinePointDto {
    p: number[];
}
export interface ObjectLineDto {
    p: ObjectLinePointDto[];
    c?: string;
}
export interface ObjectMetadataDto {
    p?: 'static' | 'kinematic' | 'dynamic';
    d?: 'low' | 'mid' | 'high';
    s?: number;
    ss?: boolean;
    group?: ObjectGroupDto;
    model?: ObjectModelDto;
    box?: ObjectBoxDto;
    gltf?: ObjectGltfDto;
    line?: ObjectLineDto;
}
export interface ObjectDto {
    id: string;
    t: 'group' | 'model' | 'gltf' | 'box' | 'line';
    p?: BasicPositionDto;
    s?: 'hosted' | 'external';
    m?: ObjectMetadataDto;
}
export interface ChunkDto {
    index: string;
    chunk_size: number;
    objects: ObjectDto[];
}
export interface ChunkPacketDto {
    t: number;
    d: ChunkDto;
}
export interface ChunksDummyFiltersDto {
    collision?: 'static' | 'kinematic' | 'dynamic';
    draw_distance?: 'low' | 'mid' | 'high';
    shadows?: boolean;
}
export interface ChunkPacketRequestDto {
    w: string;
    i: string;
    d?: boolean;
    f?: ChunksDummyFiltersDto;
}
export interface ChatPacketDto {
    t: number;
    m: string;
}
export interface ChatPacketSendDto {
    m: string;
}
export interface VoicePacketDto {
    t: number;
    p: number;
    s: number;
    e: 'delta' | 'key';
    d: object;
}
export interface VoicePacketSendDto {
    s: number;
    e: 'delta' | 'key';
    d: object;
    r?: boolean;
}
export interface SyncPacketDto {
    t: number;
    server?: ServerDto;
    packets?: EncryptedPacketsDto;
}
export interface SyncPacketSendDto {
    packets: boolean;
}
export interface ScriptSyncPacketDto {
    t: number;
    d: object[];
}
export interface ScriptActionPacketDto {
    t: number;
    e: string;
    d: object;
}
export interface CustomPacketDto {
    t: number;
    p: number;
    s: number;
    e: string;
    d?: object;
}
export interface CustomPacketSendDto {
    p: number;
    e: string;
    d?: object;
    i?: number;
}
export interface PlayerIdDto {
    player_id: number;
}
export interface ServerFiltersDto {
    name?: string;
    region?: 'global';
    favorites?: boolean;
}
export interface CreateServerDto {
    region?: 'global';
    name: string;
}
export interface UpdateScriptDto {
    name?: string;
    url: string;
    disabled?: boolean;
    settings?: object;
}
export interface UpdateServerDto {
    logo?: File;
    name?: string;
    scripts?: UpdateScriptDto[];
    commands?: CommandConfigDto[];
}
export interface KeyDto {
    token: string;
}
export interface MemberFiltersDto {
    search?: string;
}
export interface MemberDto {
    id: string;
    user: UserProfileDto;
    roles: RoleDto[];
    joined_at: string;
    last_seen_at: string;
}
export interface UserRoleFiltersDto {
    search?: string;
}
export interface UserRoleDto {
    id: string;
    user: UserProfileDto;
    role: RoleDto;
}
export interface RoleFiltersDto {
    search?: string;
}
export interface CreateRoleDto {
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
    created_at: string;
    updated_at: string;
}
export interface UpdateWorldDto {
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
    created_at: string;
}
export interface CreatePositionDto {
    position: number[];
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
    position: number[];
    rotation?: number[];
    dimension: number;
}
