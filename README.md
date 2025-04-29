# Upbot - Serverless Application Monitoring Tool

Upbot is a robust monitoring tool designed to keep track of your serverless applications' health and performance. It periodically checks your endpoints and notifies you of any issues through email.

## Features

- 🔍 **URL Monitoring**: Monitor multiple URLs with customizable check intervals
- 📊 **Real-time Status**: Track URL health status and response times
- 📈 **Historical Data**: View detailed history of URL checks and performance
- 📧 **Email Notifications**: Receive alerts via email when issues are detected
- 📱 **User Dashboard**: Intuitive interface to manage and monitor your URLs
- 🔒 **Secure Authentication**: JWT-based authentication for secure access


### Backend
- Node.js with Express
- TypeScript for type safety
- MongoDB for data storage
- JWT for authentication
- Nodemailer for email notifications



## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- NPM or Yarn
- Email service credentials (for notifications)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/upbot.git
cd upbot
```

2. Install backend dependencies:
```bash
cd backend
npm install
```



4. Create environment files:
```bash
# Backend
cp .env.example .env

```

5. Configure environment variables:
```env
# Backend (.env)
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password


```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```


2. Access the application at `http://localhost:3000`

## API Documentation

The API is available at `http://localhost:8000/api/v1` with the following endpoints:

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### URL Management
- `GET /urls` - Get all URLs for the authenticated user
- `POST /urls` - Create a new URL
- `GET /urls/:id` - Get URL details
- `PUT /urls/:id` - Update URL
- `DELETE /urls/:id` - Delete URL

### Statistics
- `GET /stats/dashboard` - Get dashboard statistics
- `GET /stats/history/:urlId` - Get URL check history

## Monitoring Configuration

The monitoring service:
- Checks URLs every 10 minutes by default
- Supports custom check intervals
- Stores check history for 30 days
- Sends email notifications for:
  - HTTP status code changes
  - Response time increases
  - Connection timeouts
  - Server errors

## Error Handling

The system handles various types of errors:
- Connection timeouts
- Invalid URLs
- Server errors
- Authentication failures
- Database errors

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email udayboranche@gmail.com or create an issue in the GitHub repository.

## Acknowledgments

- MongoDB for the database
- Nodemailer for email notifications 