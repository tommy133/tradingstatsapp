import { Status } from 'src/app/data/status';
import { Timeframe } from 'src/app/data/timeframe';

export interface Projection {
  id?: number;
  name_sym?: string;
  updown?: boolean;
  date_proj?: Date;
  name_tf?: Timeframe;
  graph?: string;
  name_st?: Status;
}
