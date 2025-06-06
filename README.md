# TekRiders E-Learning Platform

A Progressive Web Application (PWA) for e-learning, built with React and Node.js.

## Technology Stack

### Frontend
- React 18
- Vite
- PWA Support
- Bootstrap 5
- i18next for internationalization
- PouchDB for offline data persistence

### Backend
- Node.js
- Express
- CouchDB
- JWT Authentication
- Winston Logger

## Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose (for containerized development)
- CouchDB (if running locally)

## Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tekriders.git
cd tekriders
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:
```bash
# Backend (.env)
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
COUCHDB_URL=http://localhost:5984
COUCHDB_USERNAME=admin
COUCHDB_PASSWORD=your_password
```

4. Start the development servers:
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from client directory)
npm run dev
```

### Docker Development

1. Build and start the containers:
```bash
docker-compose up --build
```

2. Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- CouchDB: http://localhost:5984

## Testing

### Frontend Tests
```bash
cd client
npm test
```

### Backend Tests
```bash
cd backend
npm test
```

## Code Quality

### Linting
```bash
# Frontend
cd client
npm run lint

# Backend
cd backend
npm run lint
```

### Formatting
```bash
# Frontend
cd client
npm run format

# Backend
cd backend
npm run format
```

## API Documentation

The API documentation is available at `/api-docs` when running the backend server.

## Contributing

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Commit your changes:
```bash
git commit -m "feat: add your feature"
```

3. Push to the branch:
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, please open an issue in the GitHub repository. 