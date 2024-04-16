import { Account } from 'src/app/data/models/account';
import { Market } from 'src/app/data/models/market';
import { Status } from 'src/app/data/models/status';
import { Symbol } from 'src/app/data/models/symbol';

export interface Operation {
  id: number;
  symbol: Symbol;
  updown: number;
  dateOpen?: string;
  dateClose?: string;
  timeframe: string;
  graph?: string;
  status: Status;
  account: Account;
  market: Market;
  volume?: number;
  ratio?: number;
  revenue?: number;
}
