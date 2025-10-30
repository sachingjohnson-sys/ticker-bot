#  Ticker Bot

A Node.js application that connects to the Uphold Ticker API to monitor cryptocurrency and currency pairs, generating alerts when thresholds are breached.  
The bot is configurable via a JSON configuration file and stores its data in a PostgreSQL database.

---

##  Features

- Connects to the Uphold Ticker API  
- Generates alerts based on:
  - **Currency Pair** (`pair`)
  - **Polling Interval** (`interval`, in milliseconds)
  - **Threshold** (`threshold`)
  - **Optional Stop Duration** (`stopAfter`, in milliseconds)
- Supports multiple concurrent bots using unique `botId`s
- Persists configurations, ticker data, and alerts in PostgreSQL
- Provides a RESTful API for querying alerts
- Fully containerized with Docker for streamlined deployment

---

##  Design Decisions

| **Area**             | **Decision**                                                                 |
|----------------------|------------------------------------------------------------------------------|
| Price Metric         | Used the bid price from ticker API as the alert trigger value.              |
| Architecture         | Monolithic (bot app + alert API) for simplicity and fast iteration.          |
| Data Model           | `bot_configs`, `tickers`, and `alerts` tables in PostgreSQL.                |
| Performance          | In-memory map for threshold checks (can be replaced with Redis/Memcached).  |
| API Framework        | Built with NestJS for strong TypeScript and dependency injection support.   |
| Code Structure       | Layered modules (controller → service → DAO → DB) for single responsibility.|
| Testing              | Uses Jest for native mocking and async test support.                        |
| Database Management  | Knex migrations handle schema creation (future: add seed scripts).          |
| Logging              | Shared `bot.log` accessible from both Docker and host.                      |
| Containerization     | Includes Docker services for database, bot app, and alert API.              |

---

##  Environment Configuration

Create a `.env` file in **both**:
- the root folder, and  
- the `alerts_api/` directory  

based on `.env.example`.

Example:

```env

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ticker_bot
POSTGRES_PORT=5432
POSTGRES_HOST=db
UPHOLD_API_URL=https://api.uphold.com/v0/ticker


Notes:
Above are the correct values to be used. All key values are mandatory.

For local development, set POSTGRES_HOST=localhost.

For Docker, use POSTGRES_HOST=db.

In production, inject values securely from a secrets manager or CI/CD environment.
```


## Bot Configuration

Edit bot.config.json in the project root to define your monitoring bots.
stopAfter is optional and specifies an auto-termination period (in ms).
```env
Example:
[
  { "botId": 1, "pair": "BTC-USD", "interval": 5000, "threshold": 0.01 },
  { "botId": 2, "pair": "EUR-USD", "interval": 1000, "threshold": 0.000005, "stopAfter": 60000 }
]
```

### Local Development (Non-Docker)
```env
# Install dependencies
npm install

# Build the project
npm run build

# Start the bot
npm run start
```
Logs are written to bot.log.

### Running Tests
```env
npm run test
```

### Docker Setup
Build and Start All Services
```env
docker compose build
docker compose up
```

Run Individual Services
```env
docker compose build bot_app
docker compose up bot_app
```
Logs are written to bot.log on the host machine.

## Alerts API
### Local Setup
```env
cd alerts-api
npm install
npm run build
npm run start:prod
```
### Docker Setup
```env
docker compose build alerts_api
docker compose up alerts_api
```

### Using the Alert API
Endpoint : POST http://localhost:3000/alerts/filter

---

### Supported Filters

| **Filter**  | **Type**   | **Description**                    |
|--------------|------------|------------------------------------|
| startTime    | timestamp  | Start of alert range               |
| endTime      | timestamp  | End of alert range                 |
| pair         | string     | Currency pair                      |
| minRate      | decimal    | Minimum alert rate                 |
| maxRate      | decimal    | Maximum alert rate                 |
| botId        | int        | Filter by bot ID                   |
| configId     | int        | Filter by bot configuration ID     |
| limit        | int        | Limit number of results            |
| offset       | int        | Offset for pagination              |

---

### Example Request Body

```json
{
  "startTime": "2025-10-29T02:51:00Z",
  "endTime": "2025-10-31T06:51:30Z",
  "pair": "BTC-USD",
  "minRate": 0.01,
  "limit": 10,
  "offset": 0
}
```

## Database Schema

### Table: `bot_configs`

| **Column**    | **Type**   | **Description**          |
|---------------|------------|--------------------------|
| id            | int        | Primary key              |
| bot_id        | int        | Bot identifier           |
| pair          | string     | Currency pair            |
| interval      | int        | Polling interval (ms)    |
| threshold     | decimal    | Threshold for alerts     |
| created_at    | timestamp  | Defaults to now()        |

---

### Table: `tickers`

| **Column**      | **Type**   | **Description**              |
|-----------------|------------|------------------------------|
| id              | int        | Primary key                  |
| pair            | string     | Currency pair                |
| bid             | decimal    | Bid price                    |
| ask             | decimal    | Ask price                    |
| currency        | string     | Currency code                |
| bot_config_id   | int        | References `bot_configs.id`  |
| created_at      | timestamp  | Defaults to now()            |

---

### Table: `alerts`

| **Column**      | **Type**   | **Description**               |
|-----------------|------------|-------------------------------|
| id              | int        | Primary key                   |
| ticker_id       | int        | References `tickers.id`       |
| bot_config_id   | int        | References `bot_configs.id`   |
| rate            | decimal    | Alert rate                    |
| created_at      | timestamp  | Defaults to now()             |

---

## Tech Stack

- Node.js 20 (Alpine)  
- TypeScript  
- NestJS (API layer)  
- Knex.js (migrations and queries)  
- PostgreSQL  
- Jest (testing)  
- Docker Compose (service orchestration)  

---

## Next Steps

- Add database seeding scripts  
- Replace in-memory threshold map with Redis or Memcached for scalability  
- Add WebSocket support for real-time alert delivery  
- Extend alert filtering with cursor-based pagination and sorting  




