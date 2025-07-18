# Movie Review App

A beautiful, responsive movie review application built with React, TypeScript, and Bootstrap. Users can search for movies using the OMDB API, submit reviews with ratings, and view all reviewed movies.

## Features

- 🎬 **Movie Search**: Search for movies using the OMDB API
- ⭐ **Review System**: Rate movies from 1-5 stars with written reviews
- 💾 **Local Storage**: Reviews are saved locally in the browser
- 🎨 **Beautiful UI**: A24-inspired design with smooth animations
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile
- ♿ **Accessible**: Full keyboard navigation and screen reader support
- 🔐 **Admin Panel**: Admin login and dashboard functionality
- 🌙 **Theme Support**: Dark/light theme context (ready for implementation)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd movie-review-app-new
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```
   REACT_APP_OMDB_API_KEY=your_omdb_api_key_here
   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## API Key Setup

This app uses the OMDB API. To get your own API key:

1. Visit [OMDB API](http://www.omdbapi.com/apikey.aspx)
2. Request a free API key
3. Add it to your `.env` file as `REACT_APP_OMDB_API_KEY`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   ├── Landing.jsx     # Main landing page
│   ├── MovieCard.tsx   # Movie card component
│   └── ...
├── pages/              # Page components
│   ├── AdminDashboard.tsx
│   ├── AdminLogin.tsx
│   └── Home.tsx
├── context/            # React context providers
│   ├── MovieContext.tsx
│   └── ThemeContext.tsx
├── assets/             # Static assets
│   └── images/
└── types.ts            # TypeScript type definitions
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (not recommended)

## Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **Bootstrap 5** - CSS framework
- **React Router** - Client-side routing
- **React Hot Toast** - Notifications
- **Styled Components** - CSS-in-JS
- **GSAP** - Animations
- **Lucide React** - Icons

## Git Setup (If Git is not installed)

If you're having trouble with git installation on Windows:

### Option 1: Manual Installation

1. Download Git for Windows from [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Run the installer as Administrator
3. Follow the installation wizard

### Option 2: GitHub Desktop

1. Download GitHub Desktop from [https://desktop.github.com/](https://desktop.github.com/)
2. Install and sign in with your GitHub account
3. Clone your repository through the GUI

### Option 3: Chocolatey (if you have it)

```bash
# Run PowerShell as Administrator
choco install git -y
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [OMDB API](http://www.omdbapi.com/) for movie data
- [A24](https://a24films.com/) for design inspiration
- [Bootstrap](https://getbootstrap.com/) for the UI framework
  #   M o v i e _ r e v i e w 
   
   
#   M o v i e _ r e v i e w  
 