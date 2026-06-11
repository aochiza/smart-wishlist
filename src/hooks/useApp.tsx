import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AppState, Wish, WishStatus } from '../types';
import { loadState, saveState } from '../store/storage';

type Action =
  | { type: 'ADD_WISH'; wish: Wish }
  | { type: 'UPDATE_WISH'; wish: Wish }
  | { type: 'DELETE_WISH'; id: string }
  | { type: 'MOVE_WISH'; id: string; status: WishStatus }
  | { type: 'TOGGLE_PIN'; id: string }
  | { type: 'ADD_CATEGORY'; category: string }
  | { type: 'DELETE_CATEGORY'; category: string }
  | { type: 'SET_THEME'; theme: 'light' | 'dark' }
  | { type: 'IMPORT'; state: AppState }
  | { type: 'REORDER_WISHES'; wishes: Wish[] };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_WISH':
      return { ...state, wishes: [action.wish, ...state.wishes] };
    case 'UPDATE_WISH':
      return { ...state, wishes: state.wishes.map(w => w.id === action.wish.id ? action.wish : w) };
    case 'DELETE_WISH':
      return { ...state, wishes: state.wishes.filter(w => w.id !== action.id) };
    case 'MOVE_WISH':
      return { ...state, wishes: state.wishes.map(w => w.id === action.id ? { ...w, status: action.status } : w) };
    case 'TOGGLE_PIN':
      return { ...state, wishes: state.wishes.map(w => w.id === action.id ? { ...w, pinned: !w.pinned } : w) };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.category] };
    case 'DELETE_CATEGORY':
      return { ...state, categories: state.categories.filter(c => c !== action.category) };
    case 'SET_THEME':
      return { ...state, theme: action.theme };
    case 'IMPORT':
      return action.state;
    case 'REORDER_WISHES':
      return { ...state, wishes: action.wishes };
    default:
      return state;
  }
}

interface ContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<ContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
