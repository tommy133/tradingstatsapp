interface Symbol {
  id: number;
  nameSymbol: string;
}

interface Status {
  id: number;
  nameStatus: string;
}

export interface Operation {
  id: number;
  symbol: Symbol;
  updown: boolean;
  time_op?: string;
  time_close?: string;
  timeframe: string;
  graph?: string;
  status: Status;
  account: string;
  volume?: number;
  ratio?: number;
  points?: number;
}
