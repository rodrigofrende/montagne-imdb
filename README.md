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

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

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

## 👏 Acknowledgments

- [OMDb API](https://www.omdbapi.com/) for providing movie data
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the blazing fast build tool
- [React](https://react.dev/) for the amazing UI library



