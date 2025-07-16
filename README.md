# Onyx AI Assistant v1.2

A proactive, cross-platform executive assistant built for Axim Systems. This React prototype demonstrates the core functionality of the Onyx AI system as specified in the v1.2 whitepaper.

## Features

### Core Functionality
- **Conversational Interface**: Natural language processing with voice and text input
- **Proactive Insights**: Automated monitoring and actionable recommendations
- **Executive Dashboard**: Real-time system status and tool availability
- **Memory System**: Persistent conversation history with confidence scoring
- **Tool Integration**: Modular tool architecture for various business operations

### User Interface
- **Modern Design**: Glass morphism UI with premium animations
- **Responsive Layout**: Optimized for desktop and mobile devices
- **Voice Recognition**: Simulated voice input with visual feedback
- **Real-time Updates**: Live status indicators and processing states

### Security & Authentication
- **OAuth Integration**: Google-based authentication system
- **Protected Routes**: Secure access to executive functions
- **Session Management**: Persistent login state

## Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom design system
- **Icons**: React Icons (Feather Icons)
- **Animations**: Framer Motion
- **Routing**: React Router DOM with Hash Router
- **State Management**: React Context API

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd onyx-ai-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Usage

### Demo Credentials
- **Email**: jrellars@gmail.com
- **Password**: demo

### Core Commands
Try these example commands to interact with Onyx:
- "Check my emails"
- "Schedule overview"
- "Frontier project status"
- "Revenue report"

### Voice Input
Click the microphone button to simulate voice recognition. The system will process a mock command and provide an intelligent response.

## Architecture

### Component Structure
```
src/
├── components/
│   ├── MainInterface.jsx      # Main application layout
│   ├── ConversationPanel.jsx  # Chat interface
│   ├── InputPanel.jsx         # Input controls
│   ├── Header.jsx             # Navigation header
│   ├── SystemStatus.jsx       # System monitoring
│   ├── ProactiveInsights.jsx  # AI recommendations
│   └── ToolsPanel.jsx         # Available tools display
├── contexts/
│   ├── AuthContext.jsx        # Authentication state
│   └── OnyxContext.jsx        # Main application state
└── common/
    └── SafeIcon.jsx           # Icon component wrapper
```

### State Management
- **AuthContext**: Handles user authentication and session management
- **OnyxContext**: Manages conversation state, tool availability, and system status

## Available Tools

The system simulates integration with the following tools:
- **GoogleDriveTool**: File management and document operations
- **GoogleSheetsTool**: Spreadsheet data manipulation
- **GmailTool**: Email processing and management
- **WordPressTool**: Content management system integration
- **CameraTool**: Image capture and analysis
- **FrontierTool**: Lead generation and CRM integration

## Proactive Features

### Automated Insights
- Email summaries and priority detection
- Calendar alerts and meeting preparation
- Revenue tracking and business metrics
- Project status monitoring

### Intelligent Responses
- Context-aware command processing
- Confidence scoring for AI responses
- Tool usage tracking and optimization
- Persistent conversation memory

## Development

### Build Process
```bash
npm run build
```

### Linting
```bash
npm run lint
```

### Preview Production Build
```bash
npm run preview
```

## Future Enhancements

This prototype serves as the foundation for the full Onyx AI system, which will include:
- **Flutter Mobile App**: Cross-platform mobile interface
- **LangChain Backend**: Python-based AI orchestration
- **Google Cloud Integration**: Production hosting and services
- **Vector Memory**: Pinecone-based semantic search
- **Real Tool Integration**: Live API connections to business systems

## Contributing

This is a proprietary system for Axim Systems. All development should follow the architectural guidelines specified in the Onyx AI Initiative Whitepaper v1.2.

## License

Proprietary - Axim Systems Internal Use Only