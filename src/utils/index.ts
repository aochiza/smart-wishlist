import { Wish } from '../types';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function calcProgress(wish: Wish): number {
  if (!wish.price) return 0;
  return Math.min(100, Math.round((wish.saved / wish.price) * 100));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function priorityOrder(p: string): number {
  return p === 'high' ? 0 : p === 'medium' ? 1 : 2;
}

export function sortWishes(wishes: Wish[]): Wish[] {
  return [...wishes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return priorityOrder(a.priority) - priorityOrder(b.priority);
  });
}
