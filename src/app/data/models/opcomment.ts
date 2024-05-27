export interface OperationComment {
  id_opc?: number;
  comment: string;
  id_op: number;
  inserted_at: string;
}

export interface CreateOperationCommentInput {
  comment: string;
  id_op: number;
}
