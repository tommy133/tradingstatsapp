export interface ProjectionComment {
  id_pc?: number;
  comment: string;
  id_proj: number;
  inserted_at: string;
}

export interface CreateProjectionCommentInput {
  comment: string;
  id_proj: number;
}
