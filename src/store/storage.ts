import { AppState, Wish, DEFAULT_CATEGORIES } from '../types';

const STORAGE_KEY = 'smart-wishlist-v1';

const defaultWishes: Wish[] = [
  {
    id: '1',
    title: 'Steam Deck OLED',
    description: 'Портативная игровая консоль от Valve с OLED-дисплеем',
    image: null,
    link: 'https://store.steampowered.com/steamdeck',
    price: 600,
    saved: 350,
    category: 'Игры',
    priority: 'high',
    status: 'saving',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Смотреть на распродажах',
    pinned: true,
  },
  {
    id: '2',
    title: 'Sony WH-1000XM5',
    description: 'Беспроводные наушники с лучшим шумоподавлением',
    image: null,
    link: 'https://www.sony.com',
    price: 380,
    saved: 0,
    category: 'Техника',
    priority: 'medium',
    status: 'planning',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: null,
    notes: '',
    pinned: false,
  },
  {
    id: '3',
    title: 'Поездка в Токио',
    description: 'Двухнедельное путешествие в Японию',
    image: null,
    link: '',
    price: 3000,
    saved: 800,
    category: 'Путешествия',
    priority: 'high',
    status: 'saving',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Апрель — сезон сакуры',
    pinned: false,
  },
  {
    id: '4',
    title: 'MacBook Pro M3',
    description: 'Ноутбук Apple с чипом M3 Pro, 18GB RAM',
    image: null,
    link: 'https://apple.com',
    price: 2500,
    saved: 0,
    category: 'Техника',
    priority: 'low',
    status: 'want',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: null,
    notes: '',
    pinned: false,
  },
  {
    id: '5',
    title: 'Dune: Box Set',
    description: 'Полная коллекция книг Фрэнка Герберта',
    image: null,
    link: '',
    price: 80,
    saved: 80,
    category: 'Книги',
    priority: 'medium',
    status: 'bought',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: null,
    notes: 'Куплено на Amazon',
    pinned: false,
  },
];

const defaultState: AppState = {
  wishes: defaultWishes,
  categories: DEFAULT_CATEGORIES,
  theme: 'dark',
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return JSON.parse(raw);
  } catch {
    return defaultState;
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function exportData(state: AppState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `smart-wishlist-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(file: File): Promise<AppState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch {
        reject(new Error('Неверный формат файла'));
      }
    };
    reader.onerror = () => reject(new Error('Ошибка чтения файла'));
    reader.readAsText(file);
  });
}
