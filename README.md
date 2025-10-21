# LineLens Frontend

A modern Vue.js frontend application for the LineLens queue management and prediction system.

## Features

- **Queue Management**: Create, view, and update queue statuses
- **AI Predictions**: Run predictions and get forecasts for wait times and entry probabilities
- **User Reports**: Submit and manage real-time queue reports
- **Virtual Check-in**: Reserve spots in queues remotely
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Live data synchronization with the backend

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and development server
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Lucide Vue Next** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Backend server running on http://localhost:8000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── ActivityItem.vue
│   ├── CreateQueueModal.vue
│   ├── FeatureCard.vue
│   ├── NavBar.vue
│   ├── PredictionCard.vue
│   ├── QueueCard.vue
│   ├── ReportCard.vue
│   ├── ReservationCard.vue
│   ├── ReserveSpotModal.vue
│   ├── RunPredictionModal.vue
│   ├── StatCard.vue
│   ├── SubmitReportModal.vue
│   ├── UpdateStatusModal.vue
│   ├── ViewReportModal.vue
│   ├── ViewReservationModal.vue
│   └── ViewStatusModal.vue
├── services/            # API service layer
│   └── api.js
├── stores/              # Pinia stores for state management
│   ├── checkinStore.js
│   ├── predictionStore.js
│   ├── queueStore.js
│   └── reportStore.js
├── views/               # Page components
│   ├── Dashboard.vue
│   ├── Predictions.vue
│   ├── QueueManagement.vue
│   ├── UserReports.vue
│   └── VirtualCheckIn.vue
├── router/              # Vue Router configuration
│   └── index.js
├── App.vue              # Root component
├── main.js              # Application entry point
└── style.css            # Global styles
```

## API Integration

The frontend communicates with the backend through the following API endpoints:

### QueueStatus
- `POST /api/QueueStatus/createQueue` - Create a new queue
- `POST /api/QueueStatus/updateStatus` - Update queue status
- `POST /api/QueueStatus/_viewStatus` - View queue status

### Prediction
- `POST /api/Prediction/runPrediction` - Run AI prediction
- `POST /api/Prediction/getForecast` - Get forecast
- `POST /api/Prediction/cleanOldReports` - Clean old reports

### UserReport
- `POST /api/UserReport/submitReport` - Submit user report
- `POST /api/UserReport/setReportValidationStatus` - Validate report
- `POST /api/UserReport/_getReport` - Get report details
- `POST /api/UserReport/_getValidatedReportsByQueue` - Get validated reports
- `POST /api/UserReport/_getAllReports` - Get all reports

### VirtualCheckIn
- `POST /api/VirtualCheckIn/reserveSpot` - Reserve spot
- `POST /api/VirtualCheckIn/cancelSpot` - Cancel reservation
- `POST /api/VirtualCheckIn/expireReservations` - Expire reservations
- `POST /api/VirtualCheckIn/_getReservationDetails` - Get reservation details
- `POST /api/VirtualCheckIn/_getUserActiveReservation` - Get user reservation

## State Management

The application uses Pinia for state management with the following stores:

- **queueStore**: Manages queue data and operations
- **predictionStore**: Handles prediction data and AI operations
- **reportStore**: Manages user reports and validation
- **checkinStore**: Handles virtual check-in reservations

## Styling

The application uses Tailwind CSS for styling with a custom design system:

- **Primary Colors**: Blue theme for main actions
- **Secondary Colors**: Gray theme for secondary elements
- **Status Colors**: Green (success), Red (error), Yellow (warning), Orange (info)
- **Responsive Design**: Mobile-first approach with breakpoints

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI

### Code Style

- Use Vue 3 Composition API with `<script setup>`
- Follow Vue.js style guide
- Use TypeScript-style prop definitions
- Implement proper error handling
- Use semantic HTML elements

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the LineLens system and follows the same license terms.
