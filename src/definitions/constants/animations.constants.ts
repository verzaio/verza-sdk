export const ANIM_GROUP_IDLE = 0;

export const ANIM_GROUP_WALKING = 1;

export const ANIM_GROUP_RUNNING = 2;

export const ANIM_GROUP_JUMPING = 3;

export const ANIM_GROUP_FALLING = 4;

export const ANIMATIONS = {
  /* none */
  none: 0,

  /* idle */
  idle_male: 10,
  idle_female: 11,
  idle_neutral_1: 12,
  idle_neutral_2: 13,

  /* dead */
  dead: 20,

  /* walking */
  walking_style_1: 30,
  walking_style_2: 31,
  walking_style_3: 32,
  walking_style_4: 33,

  /* running */
  running: 40,

  /* jumping */
  jumping_long: 50,

  /* falling */
  falling: 60,

  /* rolling */
  rolling: 61,
};

export const ANIMATIONS_INDEX = Object.entries(ANIMATIONS).reduce(
  (anims, anim) => {
    anims[anim[1]] = anim[0] as keyof typeof ANIMATIONS;
    return anims;
  },
  {} as Record<number, keyof typeof ANIMATIONS>,
);
