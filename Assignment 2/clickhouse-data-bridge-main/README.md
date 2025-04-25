
# ClickHouse Data Bridge

A bidirectional data transfer tool for moving data between ClickHouse and flat files (CSV/TSV).

## Features

- **JWT-based Authentication**: Secure connection to ClickHouse instances
- **Bidirectional Transfer**: Import data from files to ClickHouse or export from ClickHouse to downloadable files
- **Schema Discovery**: Auto-detect file columns and data types, view ClickHouse tables and schemas
- **Column Selection**: Choose specific columns to include in your transfers
- **Real-time Progress**: Monitor transfer progress with logs and status indicators

## Tech Stack

- **Frontend**: React with TypeScript
- **UI Components**: Shadcn UI
- **State Management**: React Context API + React Query
- **File Processing**: Client-side CSV/TSV parsing

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:8080`

## Usage

1. **Connect to ClickHouse**:
   - Enter your ClickHouse host, port, and JWT token
   - Click "Test Connection" to verify

2. **Configure Data Flow**:
   - Select Import (File → ClickHouse) or Export (ClickHouse → File)
   - Choose your source and target

3. **Upload or Select Data**:
   - For imports: Upload a CSV/TSV file
   - For exports: Select a ClickHouse table

4. **Configure Columns**:
   - View and select columns to include in the transfer
   - The schema viewer shows column names, types, and sample values

5. **Start Transfer**:
   - Click the "Start Import" or "Start Export" button
   - Monitor the progress in real-time

## Development

This project uses:
- Vite for fast development and building
- TypeScript for type safety
- Tailwind CSS for styling
- Shadcn UI components

## License

MIT
