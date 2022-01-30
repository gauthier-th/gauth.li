export interface DBUser {
  id: string;
  username: string;
  key?: string;
  createdAt: number;
}

export interface DBId {
  id: string;
  type: 'file' | 'link';
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

export interface DBLink {
  id: string;
  link: string;
  userId: string;
  createdAt: number;
  updatedAt?: number;
  deletedAt?: number;
}