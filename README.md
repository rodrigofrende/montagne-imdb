# 🎬 DevMovies

A modern, responsive movie search application built with React and Tailwind CSS, powered by the OMDb API.

![DevMovies Banner](https://via.placeholder.com/1200x400/9333ea/ffffff?text=DevMovies+-+Discover+Your+Next+Favorite+Movie)

## ✨ Features

- 🔍 **Powerful Search** - Search through thousands of movies by title
- 📱 **Fully Responsive** - Beautiful design that works on all devices
- 🎨 **Modern UI/UX** - Stunning glassmorphism effects and smooth animations
- ♿ **Accessible** - Built with accessibility best practices and ARIA labels
- 📄 **Pagination** - Navigate through large result sets with ease
- 🎯 **Detailed View** - Click any movie to see comprehensive information
- ⚡ **Fast & Performant** - Optimized with lazy loading and efficient state management
- 🌈 **Visual Polish** - Gradient backgrounds, hover effects, and micro-interactions

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OMDb API Key (get yours at [omdbapi.com](https://www.omdbapi.com/apikey.aspx))

### Installation

1. Clone the repository
```bash
git clone https://github.com/rodrigofrende/montagne-imdb.git
cd montagne-imdb
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```bash
VITE_OMDB_API_KEY=your_api_key_here
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
montagne-imdb/
├── src/
│   ├── components/          # React components
│   │   ├── MovieCard.jsx    # Individual movie card with hover effects
│   │   ├── MovieGrid.jsx    # Grid layout for movie cards
│   │   ├── MovieModal.jsx   # Detailed movie information modal
│   │   ├── Pagination.jsx   # Pagination controls
│   │   └── SearchBar.jsx    # Search input with validation
│   ├── services/            # API services
│   │   └── omdbApi.js       # OMDb API integration
│   ├── App.jsx              # Main application component
│   ├── index.css            # Global styles and animations
│   └── main.jsx             # Application entry point
├── public/                  # Static assets
├── index.html               # HTML template with SEO meta tags
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
└── README.md                # Project documentation
```

## 🛠️ Built With

- **React 19** - UI library
- **Vite** - Next generation frontend tooling
- **Tailwind CSS 4** - Utility-first CSS framework
- **OMDb API** - Movie database API

## 🎨 Design Decisions

### Color Palette
- **Primary**: Red (`red-600` / `#dc2626`) - Montagne brand color
- **Background**: Pure black (`black`) with subtle grid pattern
- **Secondary**: Zinc tones (`zinc-800`, `zinc-900`) for cards and surfaces
- **Text**: White for primary content, gray scale for secondary
- **Accents**: Red for interactive elements, borders, and highlights

### UI/UX Principles
- **Progressive Disclosure**: Information revealed on interaction
- **Micro-interactions**: Subtle animations and hover effects
- **Visual Hierarchy**: Clear typography and spacing
- **Accessibility First**: Semantic HTML, ARIA labels, keyboard navigation
- **Mobile First**: Responsive design starting from mobile viewports

### Performance Optimizations
- Lazy loading for images
- Debounced search input
- Efficient state management with React hooks
- Minimal re-renders with proper dependency arrays

## 📦 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Testing
- `npm test` - Run unit tests with Jest
- `npm run test:watch` - Run unit tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run test:e2e` - Run E2E tests with Playwright
- `npm run test:e2e:ui` - Run E2E tests with Playwright UI
- `npm run test:e2e:headed` - Run E2E tests in headed mode (visible browser)
- `npm run test:all` - Run all tests (unit + E2E)

## 🌟 Features Breakdown

### Search Functionality
- Real-time search validation
- Minimum 2 characters required
- Visual feedback on focus/blur
- Suggested search terms

### Movie Cards
- Hover effects with scale transformation
- Lazy-loaded images
- Year badge overlay
- Smooth transitions
- Keyboard accessible

### Movie Modal
- Blurred backdrop effect
- Comprehensive movie details
- Rating icons (IMDb, Rotten Tomatoes, Metacritic)
- Awards section
- Escape key to close
- Click outside to dismiss
- Body scroll lock when open

### Pagination
- Smart page number display
- Ellipsis for large page counts
- Previous/Next navigation
- Current page highlighting
- Total results counter
- Disabled states

## 🧪 Testing

This project includes comprehensive testing coverage with both unit and E2E tests.

### Unit Testing

**Framework:** Jest + React Testing Library

Unit tests cover all major components and services:
- ✅ **SearchBar** - Input validation, form submission, focus states
- ✅ **MovieCard** - Rendering, interactions, accessibility
- ✅ **Pagination** - Page navigation, disabled states, responsive behavior
- ✅ **omdbApi Service** - API calls, error handling, pagination logic

**Running Unit Tests:**
```bash
# Run all unit tests
npm test

# Run in watch mode (auto-rerun on changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Coverage Goals:**
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

### E2E Testing

**Framework:** Playwright

End-to-end tests validate complete user workflows:
- ✅ Homepage loading and initial state
- ✅ Movie search functionality
- ✅ Results display and pagination
- ✅ Movie modal interaction
- ✅ Keyboard navigation
- ✅ Error handling
- ✅ Responsive design (mobile/desktop)
- ✅ Form validation

**Running E2E Tests:**
```bash
# Run E2E tests (headless)
npm run test:e2e

# Run with UI mode (recommended for development)
npm run test:e2e:ui

# Run with visible browser
npm run test:e2e:headed

# Run all tests
npm run test:all
```

### Test Structure

```
montagne-imdb/
├── src/
│   ├── components/
│   │   ├── __tests__/
│   │   │   ├── SearchBar.test.jsx
│   │   │   ├── MovieCard.test.jsx
│   │   │   └── Pagination.test.jsx
│   ├── services/
│   │   └── __tests__/
│   │       └── omdbApi.test.js
├── e2e/
│   └── movie-search.spec.js
├── jest.config.js
├── jest.setup.js
└── playwright.config.js
```

### Writing New Tests

**Unit Test Example:**
```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

test('should do something', async () => {
  const user = userEvent.setup();
  render(<MyComponent />);
  
  const button = screen.getByRole('button');
  await user.click(button);
  
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

**E2E Test Example:**
```javascript
import { test, expect } from '@playwright/test';

test('should perform action', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button').click();
  await expect(page.getByText('Success')).toBeVisible();
});
```

## 👏 Acknowledgments

- [OMDb API](https://www.omdbapi.com/) for providing movie data
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the blazing fast build tool
- [React](https://react.dev/) for the amazing UI library
- [Jest](https://jestjs.io/) for the delightful JavaScript testing framework
- [React Testing Library](https://testing-library.com/react) for simple and complete testing utilities
- [Playwright](https://playwright.dev/) for reliable end-to-end testing



