# Smart Wishlist

Веб-приложение для управления списком желаний — с Kanban-доской, аналитикой, прогрессом накоплений и экспортом данных. Полностью локальное, без бэкенда и регистрации.

## React/TypeScript/Vite
###Домен: smart-wishlist1-4f7gjjb9p-aochizas-projects.vercel.app
<img width="1280" height="696" alt="image" src="https://github.com/user-attachments/assets/feb03248-ca60-40b2-b5db-d8a3f0115fae" />

---

## Возможности

### Kanban-доска
- Четыре колонки: **Хочу → Планирую → Коплю → Куплено**
- Перетаскивание карточек между колонками и внутри них (`@dnd-kit`)
- Карточки отображают: фото, цену, прогресс накоплений, категорию, приоритет, дедлайн

### Управление желаниями
- Полная форма: название, описание, фото, ссылка, цена, накоплено, категория, приоритет, статус, дедлайн, заметки
- Автоматический расчёт процента накопления
- Закрепление («pinned») — закреплённые отображаются первыми
- Загрузка изображений с превью (сохраняются как base64 в localStorage)

### Поиск и фильтрация
- Мгновенный поиск по названию, описанию и категории
- Фильтры: категория, статус, приоритет, диапазон цен
- Сброс всех фильтров одной кнопкой

### Категории
Встроенные: Игры, Техника, Путешествия, Книги, Автомобили, Подарки, Другое.
Пользователь может создавать свои категории прямо в форме добавления желания.

### Дашборд
- Общее количество желаний и куплено
- Сумма накоплений и полная стоимость списка
- Средняя цена желания
- Список активных накоплений с прогресс-барами
- Желания с высоким приоритетом

### Аналитика (Recharts)
- Пончиковая диаграмма распределения по статусам
- Пончиковая диаграмма распределения по приоритетам
- Бар-чарт по категориям
- Прогресс-бары по всем активным накоплениям

### Темы
- Светлая и тёмная тема
- Переключение одной кнопкой, выбор сохраняется в localStorage

### Импорт / экспорт
- Экспорт всех данных в `.json`-файл
- Импорт из `.json` — удобный перенос между устройствами

---

## Технологии

| Пакет | Версия | Назначение |
|---|---|---|
| React | 19 | UI-фреймворк |
| TypeScript | 6 | Типизация |
| Vite | 8 | Сборка и dev-сервер |
| react-router-dom | 7 | Клиентская маршрутизация |
| @dnd-kit/core | 6 | Drag & Drop |
| @dnd-kit/sortable | 10 | Сортировка карточек |
| recharts | 3 | Графики и диаграммы |
| lucide-react | 1 | Иконки |
| CSS Modules | — | Изолированные стили |

Хранение данных: **localStorage** (без бэкенда, без регистрации).

---

## Быстрый старт

### Требования
- Node.js 18+
- npm 9+

### Установка

```bash
# Распакуйте архив и перейдите в папку
cd smart-wishlist

# Установите зависимости
npm install

# Запустите dev-сервер
npm run dev
```

Приложение откроется на http://localhost:5173

### Сборка для продакшена

```bash
npm run build
```

Готовые файлы появятся в папке `dist/`. Можно деплоить на любой статический хостинг: Vercel, Netlify, GitHub Pages, Nginx.

```bash
# Предпросмотр production-сборки локально
npm run preview
```

---

## Структура проекта

```
smart-wishlist/
├── src/
│   ├── types/
│   │   └── index.ts              # Типы: Wish, WishStatus, WishPriority
│   ├── store/
│   │   └── storage.ts            # localStorage: load / save / export / import
│   ├── hooks/
│   │   ├── useApp.tsx            # Глобальный контекст + useReducer
│   │   └── useWishFilter.ts      # Хук поиска и фильтрации
│   ├── utils/
│   │   └── index.ts              # generateId, formatCurrency, calcProgress…
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx        # Главная обёртка
│   │   │   ├── Sidebar.tsx       # Боковая панель (desktop)
│   │   │   └── MobileSidebar.tsx # Drawer-меню (mobile)
│   │   ├── kanban/
│   │   │   └── KanbanColumn.tsx  # Колонка Kanban
│   │   └── wishlist/
│   │       ├── WishCard.tsx      # Карточка желания
│   │       ├── WishModal.tsx     # Форма создания / редактирования
│   │       └── FilterBar.tsx     # Поиск и фильтры
│   ├── pages/
│   │   ├── Board.tsx             # Kanban-доска (главная)
│   │   ├── Dashboard.tsx         # Дашборд с метриками
│   │   └── Statistics.tsx        # Аналитика с графиками
│   ├── styles/
│   │   └── globals.css           # Design tokens, reset, типографика
│   ├── App.tsx                   # Роутинг
│   └── main.tsx                  # Точка входа
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Модель данных

Каждое желание (`Wish`) содержит:

```typescript
interface Wish {
  id: string;           // Уникальный ID
  title: string;        // Название
  description: string;  // Описание
  image: string | null; // Base64-изображение
  link: string;         // Ссылка на товар
  price: number;        // Цена цели (₽)
  saved: number;        // Накоплено (₽)
  category: string;     // Категория
  priority: 'low' | 'medium' | 'high';
  status: 'want' | 'planning' | 'saving' | 'bought';
  createdAt: string;    // ISO-дата создания
  deadline: string | null; // ISO-дата дедлайна
  notes: string;        // Личные заметки
  pinned: boolean;      // Закреплено
}
```
