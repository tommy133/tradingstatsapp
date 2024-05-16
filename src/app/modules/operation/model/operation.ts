import { Account } from 'src/app/data/models/account';
import { Status } from 'src/app/data/models/status';
import { Symbol } from 'src/app/modules/assets/model/symbol';

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
  volume?: number;
  ratio?: number;
  revenue?: number;
}
