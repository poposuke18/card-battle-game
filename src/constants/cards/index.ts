// src/constants/cards/index.ts

export { 
  TURN1_CARDS 
} from './basic-units';

export { 
  TURN2_CARDS 
} from './effect-units';

export { 
  TURN3_CARDS 
} from './field-cards';

export { 
  TURN4_CARDS 
} from './weapon-cards';

export { 
  TURN5_CARDS 
} from './reinforcement-cards';

export { 
  TURN6_CARDS 
} from './leader-cards';

export { 
  TURN7_CARDS } from './legendary-cards';

  export {
    TURN8_CARDS,
    getBossCardForStage
  } from './boss-cards';

// カード生成のユーティリティと定数
export {
  createCard,
  generateCardId,
  BASE_POINTS,          // CARD_STATSの代わりにBASE_POINTSを使用
  EFFECT_VALUES,
  TURN_GROWTH_RATE,    // 新しく追加された定数
  STAGE_ENEMY_RATE,    // 新しく追加された定数
  calculateCardPoints  // 新しく追加された関数
} from './card-base';