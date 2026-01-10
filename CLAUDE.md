# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Calorie Tracker App** - A React-based calorie and nutrition tracking application built with Vite and Tailwind CSS. The app is designed as a mobile-first web application with a Figma-generated codebase.

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Architecture & Structure

### Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite`)
- **UI Components**: shadcn/ui patterns with Radix UI primitives
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion)
- **State Management**: React hooks (useState, useEffect) with Context API

### Project Structure
```
src/
├── main.tsx                    # Entry point
├── app/
│   ├── App.tsx                 # Root component with page routing
│   ├── context/
│   │   └── ThemeContext.tsx    # Theme management (light/dark/system)
│   └── components/
│       ├── HomePage.tsx        # Main dashboard with nutrition summary
│       ├── FeedPage.tsx        # Social feed/posts
│       ├── ProfilePage.tsx     # User profile & stats
│       ├── AddMealPage.tsx     # Add meal form
│       ├── MealHistoryPage.tsx # Historical records
│       ├── CreatePostPage.tsx  # Post creation
│       ├── GoalSettingsPage.tsx # Daily goals configuration
│       ├── PersonalInfoPage.tsx # User info settings
│       ├── ThemeSettingsPage.tsx # Theme preferences
│       ├── FoodSelectorPage.tsx # Food selection interface
│       ├── MealRecord.tsx       # Meal card component
│       ├── NutrientBar.tsx      # Nutrition progress bars
│       ├── CircularProgress.tsx # Calorie circular progress
│       ├── FloatingActionButton.tsx # FAB for adding meals
│       ├── FoodSuggestion.tsx   # Daily food suggestions
│       └── ui/                  # shadcn/ui style components
│           ├── button.tsx
│           ├── card.tsx
│           ├── dialog.tsx
│           └── ... (30+ UI components)
├── styles/
│   ├── index.css               # Main CSS imports
│   ├── tailwind.css            # Tailwind configuration
│   └── theme.css               # Theme variables
└── assets/                     # Static assets
```

### Key Architecture Patterns

**1. Page-Based Navigation (App.tsx)**
- Single-page application with manual page routing
- State-based navigation: `currentPage` controls which page component renders
- Bottom navigation bar shows for main pages (home, feed, profile)
- Sub-pages (settings, add meal, etc.) hide the bottom nav

**2. Theme System**
- ThemeContext provides `theme` (light/dark/system) and `effectiveTheme`
- Automatically applies `dark` class to `<html>` element
- Persists to localStorage
- Listens to system theme changes

**3. Component Design**
- All components are function components with TypeScript
- Props interfaces for type safety
- Local state management with useState
- Event handlers defined inline or as separate functions
- Tailwind utility classes with conditional styling

**4. Data Flow**
- Mock data used throughout (no backend integration)
- Local state for meal records, posts, user stats
- Deletion handlers passed as props (child-to-parent communication)
- Navigation callbacks passed as props

### Important Files

- **vite.config.ts**: Vite configuration with `@` alias to `src/`
- **index.html**: Entry HTML with root div and module script
- **postcss.config.mjs**: Empty (Tailwind v4 handles PostCSS automatically)
- **src/styles/tailwind.css**: Tailwind v4 with source scanning configuration

### UI Component Library

The `src/app/components/ui/` directory contains 30+ shadcn/ui-style components including:
- **Primitives**: Button, Input, Dialog, Sheet, Popover, etc.
- **Layout**: Card, Tabs, Accordion, Sidebar, etc.
- **Forms**: Checkbox, Radio, Switch, Select, Form, etc.
- **Data Display**: Badge, Progress, Avatar, etc.
- **Overlays**: Alert, Toast (Sonner), Tooltip, etc.

All components follow the same pattern:
- Use `@radix-ui` primitives
- `class-variance-authority` (cva) for variants
- `cn()` utility for class merging
- TypeScript with proper prop types

### Key Components Details

**HomePage.tsx**
- Displays daily calorie intake vs goal (circular progress)
- Shows macronutrient breakdown (protein, fat, carbs) with progress bars
- Lists meals by type (早餐/午餐/晚餐/加餐)
- Uses mock data for demonstration

**AddMealPage.tsx**
- Multi-step flow: Select meal type → Add foods → Save
- Integrates with FoodSelectorPage for food selection
- Calculates totals automatically
- Returns to home on save

**FeedPage.tsx**
- Social feed with posts
- Supports text, images, video, topics, meal references
- Like/comment interactions
- Motion animations for post cards

**ProfilePage.tsx**
- User stats summary (days tracked, records, weight progress)
- Quick navigation to settings pages
- Gradient header with user avatar

### Theme & Styling

- **Dark mode**: Enabled via `dark:` prefix classes
- **Color scheme**: Uses emerald as primary color
- **Transitions**: All pages have `transition-colors` for smooth theme switching
- **Responsive**: Mobile-first design (no desktop-specific breakpoints)

### Data Types

Common TypeScript interfaces used:
```typescript
interface FoodItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface Post {
  id: string;
  author: { name: string; avatar?: string };
  content: string;
  images?: string[];
  topics?: string[];
  mealReference?: MealReference;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked: boolean;
}
```

### Development Notes

- **No tests**: This is a prototype/Figma-generated app without test files
- **No linting**: No ESLint/Prettier configuration visible
- **No routing library**: Manual page state management
- **Mock data only**: All data is hardcoded for demonstration
- **Chinese comments**: Some components have Chinese comments/labels
- **Mobile viewport**: Designed for mobile screens (no desktop layout)

### Adding New Features

When adding new components:
1. Place reusable UI components in `src/app/components/ui/`
2. Place page-level components in `src/app/components/`
3. Use existing patterns (shadcn/ui style, cva, cn utility)
4. Update `App.tsx` if adding new pages
5. Follow existing naming conventions (PascalCase for components)

### Common Tasks

**To add a new page:**
1. Create component in `src/app/components/`
2. Add page type to `currentPage` state in `App.tsx`
3. Add render case in `renderPage()` function
4. Add navigation logic and hide from bottom nav if needed

**To modify theme colors:**
1. Update Tailwind config in `src/styles/tailwind.css` (@theme block)
2. Or use arbitrary values in component classes

**To update dependencies:**
- Check `package.json` for current versions
- Use `npm install <package>@<version>` for updates

### Attribution

This project includes components from:
- **shadcn/ui** (MIT license)
- **Unsplash** (for placeholder images)
- **Radix UI** primitives
- **Lucide** icons

### Migration Notes

The `UNIAPP_MIGRATION_GUIDE.md` file contains detailed instructions for migrating this React app to Uniapp (Vue-based) for小程序 (mini-program) deployment on WeChat/Alipay platforms.
