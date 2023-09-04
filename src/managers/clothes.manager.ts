import {ClotheItem, SkinMaskItem} from 'engine/definitions/types/clothes.types';
import {toQuaternionArray, toVector3Array} from 'engine/utils/vectors.utils';

import EngineManager from './engine.manager';

class ClothesManager {
  private _engine: EngineManager;

  private get _messenger() {
    return this._engine.messenger;
  }

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  addSkinMask(mask: SkinMaskItem) {
    this._messenger.emit('addSkinMask', [mask]);
  }

  removeSkinMask(maskId: string) {
    this._messenger.emit('removeSkinMask', [maskId]);
  }

  addClothe(clotheItem: ClotheItem) {
    this._parseClotheItem(clotheItem);

    this._messenger.emit('addClothe', [clotheItem]);
  }

  removeClothe(clotheId: string) {
    this._messenger.emit('removeClothe', [clotheId]);
  }

  private _parseClotheItem(clotheItem: ClotheItem) {
    if (clotheItem.position) {
      clotheItem.position = toVector3Array(clotheItem.position);
    }

    if (clotheItem.rotation) {
      clotheItem.rotation = toQuaternionArray(clotheItem.rotation);
    }
  }
}

export default ClothesManager;
