import { Market } from '../../../data/models/market';

export interface Symbol {
  id_sym: number;
  name_sym: string;
  market: Market;
  description?: string;
  bt_checkpoint?: string;
}
