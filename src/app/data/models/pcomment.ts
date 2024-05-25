export interface ProjectionComment {
  id_pc?: number;
  inserted_at: string;
  pcomment: string;
  id_proj: number;
}

export interface CreateProjectionCommentInput {
  id_pc?: number;
  pcomment: string;
  id_proj: number;
}
