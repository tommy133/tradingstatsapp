export interface OperationCreateInput {
  id_sym: number;
  updown: number;
  time_op?: string;
  time_close?: string;
  graph?: string;
  name_tf: string;
  id_st: number;
  id_ac: number;
  rr_ratio?: number;
  checklist?: string;
  revenue?: number;
}
