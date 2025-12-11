
export type IconType = 'line' | 'solid';
export type Role = 'designer' | 'user' | 'admin' | 'pending_designer';
export type ViewMode = 'grid' | 'list';

// --- Database Row Types (snake_case) ---
export interface DBIcon {
  id: string;
  name: string;
  content: string; // SVG string
  group_id: string | null;
  designer_id: string;
  created_at: string;
  type: IconType;
}

export interface DBGroup {
  id: string;
  name: string;
  designer_id: string;
  created_at: string;
}

// --- Application Types (camelCase) ---
export interface IconData {
  id: string;
  name: string;
  content: string;
  groupId: string | null; // Mapped from group_id
  createdAt: number;      // Mapped from created_at string
  type: IconType;
  designerId: string;     // Mapped from designer_id
}

export interface IconGroup {
  id: string;
  name: string;
}

export interface IconConfig {
  size: number;
  strokeWidth: number;
  color: string;
}
