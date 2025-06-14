# DevConnect

A modern platform for developers to connect, collaborate, and work on projects together. DevConnect provides a seamless environment for developers to find collaborators, share ideas, and build amazing projects.

## Features

- Real-time collaboration and communication
- Project management and tracking
- Developer profiles and portfolios
- Project discovery and matching
- Secure authentication and authorization

## Tech Stack

### Frontend
- React.js with TypeScript
- Modern UI components with styled-components
- Redux Toolkit for state management
- React Router for navigation
- Real-time updates using Socket.IO client
- TypeScript for type safety and better development experience

### Backend
- Node.js
- Express.js
- MongoDB
- WebSocket for real-time features

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB
- TypeScript (v4.9.5 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/SARVESHVARADKAR123/DevConnect.git
cd devconnect
```

2. Install dependencies:
```bash
npm run install:all
```

This will install dependencies for both client and server applications.

## Running the Application

1. Start both client and server concurrently:
```bash
npm start
```

Or run them separately:

2. Start the server:
```bash
npm run start:server
```

3. Start the client:
```bash
npm run start:client
```

The client will be available at `http://localhost:3000` and the server at `http://localhost:5000`.

## Project Structure

```
devconnect/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   └── src/               # Source files
├── server/                # Backend Node.js application
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── sockets/         # WebSocket handlers
└── package.json          # Root package.json
```



## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
