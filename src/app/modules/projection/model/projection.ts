interface Symbol {
  id: number;
  nameSymbol: string;
}

interface Status {
  id: number;
  nameStatus: string;
}

export interface Projection {
  id: number;
  symbol: Symbol;
  updown: boolean;
  date?: string;
  graph?: string;
  timeframe: string;
  status: Status;
}
