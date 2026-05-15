// Shared TypeScript types mirroring the FastAPI schemas.

export type UserRole = "student" | "business_owner" | "teacher" | "consultant" | "admin";
export type LangCode = "en" | "am" | "om" | "so";

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  bio?: string | null;
  country?: string | null;
  city?: string | null;
  phone?: string | null;
  role: UserRole;
  preferred_language: LangCode;
  is_active: boolean;
  is_verified: boolean;
  is_superuser: boolean;
  created_at: string;
  last_login_at?: string | null;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export type AgentType =
  | "teacher"
  | "business_consultant"
  | "agriculture"
  | "marketing"
  | "career_coach"
  | "automation"
  | "resume_builder"
  | "translator"
  | "student_tutor"
  | "startup_advisor";

export interface AgentInfo {
  key: AgentType;
  name: string;
  description: string;
}

export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  agent_type?: AgentType | null;
  tokens: number;
  attachments?: Array<Record<string, unknown>> | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  agent_type: AgentType;
  language: LangCode;
  summary: string | null;
  pinned: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
  messages?: ChatMessage[];
}

export interface CourseSummary {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  cover_image: string | null;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  language: LangCode;
  duration_minutes: number;
  is_free: boolean;
  price_cents: number;
  rating: number;
  rating_count: number;
  instructor_name: string | null;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  order_index: number;
  lesson_type: "video" | "article" | "quiz" | "interactive" | "download";
  content_markdown: string | null;
  video_url: string | null;
  duration_minutes: number;
}

export interface Course extends CourseSummary {
  description: string;
  status: "draft" | "published" | "archived";
  learning_outcomes: string[];
  prerequisites: string[];
  tags: string[];
  lessons: Lesson[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface PlanInfo {
  plan: "free" | "pro" | "enterprise";
  monthly_price_usd: number;
  features: string[];
  highlight?: string | null;
}
