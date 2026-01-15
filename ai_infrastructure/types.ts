export interface VideoStats {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string; // ISO 8601 duration
  durationSecs: number;
  ctr: number; // Click Through Rate
  retention: number; // Average Percentage Viewed
  outlierScore: number; // Calculated field
  isOutlier: boolean;
  description: string;
}

export interface ChannelStats {
  id: string;
  title: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  
  // Row 1 Derived
  avgViewsLifetime: number; // Total Views / Total Videos
  watchTimeHours: number;

  // Row 2 Engagement
  engagementRate: number;
  avgLikesPerVideo: number;
  avgCommentsPerVideo: number;

  // Row 3 Growth
  topOutlierScore: number; // Top Video / Avg of recent
  uploadConsistency: 'Consistent' | 'Inconsistent' | 'Irregular';
  avgDurationLabel: string; // e.g., "12m 30s"

  // Row 4 Business
  estimatedRevenue: number; // Mock estimation
  avatarUrl: string;
}

export interface CommentData {
  text: string;
  author: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  likeCount: number;
}

export interface StrategyInsight {
  type: 'CONTINUE' | 'START' | 'STOP';
  title: string;
  description: string;
  impactScore: number; // 1-10
}

export interface AnalysisResult {
  executiveSummary: string; // The "AI Insight Box" text
  sentimentSummary: {
    positive: number;
    neutral: number;
    negative: number;
    topPhrases: string[];
  };
  strategies: StrategyInsight[];
  contentInsights: {
    bestDuration: string;
    bestTopics: string[];
    titlePatterns: string;
  };
}

export interface DashboardData {
  channel: ChannelStats;
  videos: VideoStats[];
  comments: CommentData[];
  mockStrategies?: StrategyInsight[]; // Pre-loaded mock strategies
}