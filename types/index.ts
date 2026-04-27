export interface TikTokVideo {
  id: string;
  videoUrl: string;
  thumbnail: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  duration: number;
  hook: string;
  contentType: ContentType;
  creatorHandle: string;
  creatorFollowers: number;
  createdAt: Date;
  engagementRate: number;
  hashtags: string[];
  soundTrack: string;
  sourceNiche: string;
}

export interface SearchResult {
  id: string;
  videoId: string;
  query: string;
  rank: number;
  metrics: VideoMetrics;
  video: TikTokVideo;
}

export interface VideoMetrics {
  avgViews: number;
  avgLikes: number;
  avgEngagementRate: number;
  avgDuration: number;
  totalVideos: number;
  contentTypeBreakdown: Record<string, number>;
}

export interface ContentType {
  type:
    | "tutorial"
    | "entertainment"
    | "storytelling"
    | "challenge"
    | "educational"
    | "cute-moment"
    | "trick"
    | "transformation"
    | "lifestyle"
    | "other";
  confidence: number;
}

export interface SearchQuery {
  keyword: string;
  niche: "pet-wellness" | "diy-home" | "education" | "general";
  limit: number;
  sortBy: "views" | "engagement" | "likes" | "recent";
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface UserSession {
  userId: string;
  email: string;
  plan: "free" | "pro";
  searchesUsed: number;
  searchesLimit: number;
  createdAt: Date;
  lastLogin: Date;
}

export interface ExportData {
  query: string;
  videosAnalyzed: number;
  topVideos: TikTokVideo[];
  stats: {
    avgViews: number;
    avgLikes: number;
    avgDuration: number;
    topContentTypes: Array<{ type: string; count: number }>;
    topHashtags: Array<{ tag: string; count: number }>;
  };
  generatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}
