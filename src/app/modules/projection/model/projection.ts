import { Status } from 'src/app/data/models/status';
import { Symbol } from 'src/app/data/models/symbol';

export interface Projection {
  id: number;
  symbol: Symbol;
  updown: number;
  date?: string;
  graph?: string;
  timeframe: string;
  status: Status;
}
