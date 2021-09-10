export interface DBUser {
  id: string;
  username: string;
  key?: string;
  createdAt: number;
}

export interface DBFile {
  id: string;
  filename: string;
  mime?: string;
  userId: string;
  createdAt: number;
  updatedAt?: number;
  deletedAt?: number;
}