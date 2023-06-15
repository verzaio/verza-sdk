import {StorageMode} from 'engine/definitions/enums/storage.enums';

export type StorageModeType = Lowercase<keyof typeof StorageMode>;

export type StorageFilters = {
  search?: string;
  page?: number;
  take?: number;
  sort?: 'asc' | 'desc';
  order?: 'value' | 'created_at' | 'updated_at';
};

export type StorageResultItem<T = unknown> = {
  key: string;
  value: T;
};

export type StorageResult<T = unknown> = {
  data: StorageResultItem<T>[];
  page: number;
  take: number;
  count: number;
};
