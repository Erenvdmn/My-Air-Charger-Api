# My-Air-Charger-Api

Welcome to **My-Air-Charger-Api**!  
This project provides an API for managing and tracking air charger devices, their usage, and operations. It is designed to enable integration with IoT devices or clients interested in monitoring, controlling, or querying air charger states and statistics.

## Features

- **Device Registration:** Add and manage air charger devices.
- **Status Monitoring:** Retrieve status updates for air chargers.
- **Usage Tracking:** Log sessions, start/stop events, and aggregate charging statistics.
- **RESTful API:** Exposes endpoints for common operations (CRUD for devices, usage sessions, status queries).
- **Authentication (optional):** Secure endpoints with API keys or JWT tokens.
- **Extensible:** Easily add new data models, endpoints, or enhancements as your needs grow.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (recommended v16+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) for dependency management
- (If using a database) [MongoDB](https://www.mongodb.com/) or another compatible backend

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/Erenvdmn/My-Air-Charger-Api.git
   cd My-Air-Charger-Api
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment variables**  
   Create a `.env` file in the root directory. Example:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/my-air-charger
   JWT_SECRET=your-secret
   ```

4. **Run the server**
   ```sh
   npm start
   ```

## Usage

### API Endpoints

Typical endpoints may include:

- `GET /api/devices` — List all air charger devices
- `POST /api/devices` — Register a new air charger
- `GET /api/devices/{id}` — Get details for a specific device
- `PUT /api/devices/{id}` — Update device information
- `DELETE /api/devices/{id}` — Remove a device
- `POST /api/usage` — Log a usage session
- `GET /api/usage?device={id}` — Get usage logs for a device

> Consult the API documentation (e.g., [Swagger](https://swagger.io/) UI at `/api-docs`, if available) for detailed request/response formats.

## Project Structure

```
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── utils/
├── .env
├── package.json
└── README.md
```

## Contributing

Contributions are welcome!  
To propose a change or get involved:

1. Fork the repository.
2. Open a pull request with your proposed changes.
3. Ensure code style and tests pass.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Contact

- Creator: [Erenvdmn](https://github.com/Erenvdmn)
- Issues/Bugs: Please use [GitHub Issues](https://github.com/Erenvdmn/My-Air-Charger-Api/issues)

---

*Happy charging!*
