# RPG Core

A comprehensive web application for creating, managing, and running tabletop RPG adventures. Built for game masters and players who want streamlined tools for world-building, adventure creation, and campaign management.

## What is RPG Core?

RPG Core helps you:

- **Create Adventures**: Build structured adventures with episodes, scenes, and rich content
- **Manage Assets**: Organize characters, creatures, locations, and items
- **Build Worlds**: Develop detailed settings with timelines, lore, and stories
- **Run Campaigns**: Access everything you need during game sessions

## Tech Stack

### Frontend (`rpg-ui/`)

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for development and building
- **React Router** for navigation
- **Storybook** for component development

### Backend (`rpg-api/`)

- **Go** with Gin web framework
- **PostgreSQL** database with GORM
- **Google OAuth** authentication
- **Cloudflare Images** for asset management
- **JWT** for session management

## Getting Started

### Prerequisites

- Node.js 18+
- Go 1.21+
- PostgreSQL 15+
- Docker (optional, for database)

### Quick Start

1. **Start the database**:

   ```bash
   cd rpg-api
   docker-compose up -d postgres
   ```

2. **Set up the backend**:

   ```bash
   cd rpg-api
   cp example.env .env
   # Edit .env with your configuration
   go mod download
   go run main.go
   ```

3. **Set up the frontend**:

   ```bash
   cd rpg-ui
   npm install
   npm run dev
   ```

4. **Access the app**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - Database Admin: http://localhost:8081 (Adminer)

## Project Structure

```
├── rpg-ui/          # React frontend
│   ├── src/         # Source code
│   └── stories/     # Storybook stories
├── rpg-api/         # Go backend
│   ├── internal/    # Go application code
│   └── main.go      # Entry point
└── README.md        # This file
```

## Features

- 🎲 **Adventure Builder** - Create structured adventures with episodes and scenes
- 🏰 **World Management** - Build detailed settings with history and lore
- 👥 **Asset Library** - Organize NPCs, monsters, locations, and items
- 📖 **Campaign Tools** - Everything needed to run great sessions
- 🔐 **User Management** - Secure authentication with Google OAuth
- 📱 **Responsive Design** - Works on desktop and mobile

## Contributing

This is a propriatory project and does not accept external contributions at this time. If you're interested in getting involved, please contact me at naetharu@gmail.com to discuss.

## License

Built with the Simple D6 RPG System
