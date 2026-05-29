export type JobStatus = 'queued' | 'downloading' | 'uploading' | 'completed' | 'failed';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  isAllowed: boolean;
  emailVerified?: boolean;
}

export interface Session {
  token: string;
  user: User;
}

export interface Job {
  id: string;
  userId: string;
  sourceUrl: string;
  status: JobStatus;
  progressStage?: string;
  progressPercent?: number;
  youtubeVideoId?: string;
  youtubeUrl?: string;
  errorCode?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface CreateJobRequest {
  sourceUrl: string;
}

export interface ApiError {
  message: string;
  code?: string;
}
