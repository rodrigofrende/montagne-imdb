# Custom React Hooks

This directory contains reusable custom hooks for the DevMovies application.

## 🎯 Philosophy

We maintain **only hooks that are actually used** in the application. No dead code, no "maybe we'll use it later" hooks. Every hook here serves a real purpose.

## 📚 Available Hooks (2 total)

### 1. `useLocalStorage` ✅ IN USE

Persists state in localStorage with automatic synchronization.

```javascript
import { useLocalStorage } from './hooks';

// Real usage in App.jsx
const [recentSearches, setRecentSearches] = useLocalStorage('devmovies-recent-searches', []);

// When user searches, save to recent
setRecentSearches(prev => {
  const filtered = prev.filter(s => s.toLowerCase() !== term.toLowerCase());
  return [term, ...filtered].slice(0, 5); // Keep max 5
});
```

**Current Implementation:**
- Saves user's last 5 search queries
- Persists across browser sessions
- Prevents duplicates (case-insensitive)
- Shows in dropdown when focusing search input

**Parameters:**
- `key`: localStorage key
- `initialValue`: Default value if key doesn't exist

**Returns:** `[storedValue, setValue]` - Same as useState but persisted

---

### 2. `useKeyboardShortcut` ✅ IN USE

Handles keyboard shortcuts declaratively.

```javascript
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut';

// Real usage in SearchBar.jsx
// Focus search input on "/" (works with any keyboard layout)
// Will trigger whether "/" is typed with or without Shift
useKeyboardShortcut('/', () => {
  if (document.activeElement !== inputRef.current) {
    inputRef.current?.focus();
  }
});

// Clear search on "Escape" (no modifiers)
useKeyboardShortcut('Escape', () => {
  if (document.activeElement === inputRef.current && searchTerm) {
    handleClear();
  }
});

// Example: Save with Ctrl+S (explicitly requires Ctrl)
useKeyboardShortcut('s', handleSave, { ctrlKey: true });
```

**Current Implementation:**
- `/` key focuses the search input
- `Escape` key clears the search (when focused)
- Works globally across the app
- Prevents default browser behavior

**Parameters:**
- `key`: The key to listen for (e.g., '/', 'Escape', 's')
- `callback`: Function to execute when key is pressed
- `options`: (Optional)
  - `ctrlKey`: Require Ctrl (default: undefined - ignores Ctrl state)
  - `shiftKey`: Require Shift (default: undefined - ignores Shift state)
  - `altKey`: Require Alt (default: undefined - ignores Alt state)
  - `preventDefault`: Prevent default behavior (default: true)

**Note:** Modifiers are only checked if explicitly specified. This allows the hook to work with different keyboard layouts (e.g., Spanish keyboards where "/" requires Shift+7).

---

## 🧪 Testing

All hooks are fully tested with high coverage. Run tests with:

```bash
npm test
```

**Test Coverage:**
- `useLocalStorage`: 8 tests ✅
- `useKeyboardShortcut`: Tested via SearchBar integration ✅

Test files are located in `src/hooks/__tests__/`

## 📦 Importing

```javascript
// From index (recommended)
import { useLocalStorage } from './hooks';

// Direct import (avoids circular dependencies)
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut';
```

## 🎯 Features Powered by Custom Hooks

1. **Recent Searches** (`useLocalStorage`)
   - Last 5 searches saved
   - Shown in dropdown when focusing search
   - Click to re-search instantly
   - Persists across browser sessions

2. **Keyboard Shortcuts** (`useKeyboardShortcut`)
   - `/` - Focus search (like GitHub)
   - `Escape` - Clear search input
   - Accessible and power-user friendly

## 🔧 Adding New Hooks

**Only add hooks that will be used immediately.** No speculative code.

When adding a new hook:

1. Have a real use case in mind
2. Create the hook file in `src/hooks/`
3. Write tests in `src/hooks/__tests__/`
4. Export from `src/hooks/index.js`
5. Implement in actual component
6. Document here with real example

---

Made with ❤️ for DevMovies

