export type WishStatus = 'want' | 'planning' | 'saving' | 'bought';
export type WishPriority = 'low' | 'medium' | 'high';

export const STATUS_LABELS: Record<WishStatus, string> = {
  want: 'Хочу',
  planning: 'Планирую',
  saving: 'Коплю',
  bought: 'Куплено',
};

export const PRIORITY_LABELS: Record<WishPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
};

export const DEFAULT_CATEGORIES = [
  'Игры',
  'Техника',
  'Путешествия',
  'Книги',
  'Автомобили',
  'Подарки',
  'Другое',
];

export interface Wish {
  id: string;
  title: string;
  description: string;
  image: string | null;
  link: string;
  price: number;
  saved: number;
  category: string;
  priority: WishPriority;
  status: WishStatus;
  createdAt: string;
  deadline: string | null;
  notes: string;
  pinned: boolean;
}

export interface AppState {
  wishes: Wish[];
  categories: string[];
  theme: 'light' | 'dark';
}
