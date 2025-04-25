# zeotap-software-intern-assignments
📂 Assignment 1: Wrangler Enhancement – Byte Size and Time Duration Parsers
✅ What I Built
This enhancement adds native support for parsing byte sizes (e.g., KB, MB, GB) and time durations (e.g., ms, s, h) within CDAP Wrangler recipes. It modifies the ANTLR grammar, extends the Wrangler API, and introduces a new directive: aggregate-stats.

🛠️ How to Run It
🔧 Prerequisites
Java 8+

Maven

Git

🧪 Steps

# Clone my fork
git clone https://github.com/Dev-Faldu/wrangler.git
cd wrangler

# Compile and regenerate ANTLR parser
mvn clean install
📁 Files Modified:
Directives.g4 (added BYTE_SIZE and TIME_DURATION)

ByteSize.java, TimeDuration.java in wrangler-api

New directive class AggregateStatsDirective.java in wrangler-core

🧪 Edge Cases Tested
Parsing mixed units: 1.5MB, 500ms, 2h

Invalid formats: 10KBB, 123xyz, --ms

Directive handling with empty/null values

Output in different units (e.g., MB, seconds)

🧾 AI Tool Usage
I used ChatGPT to:

Generate ANTLR lexer and parser rule patterns

Design ByteSize and TimeDuration parsing logic

Suggest test cases and directive logic

See prompts.txt for full AI prompt history.

📂 Assignment 2: ClickHouse ↔ Flat File Data Ingestion Tool
✅ What I Built
A full-stack web application that allows bidirectional ingestion between ClickHouse and Flat File (CSV) with a modern UI. It includes:

Column-level selection

JWT-based ClickHouse authentication

Schema discovery

Batch ingestion

Record count reporting

🛠️ How to Run It
Backend (Python + FastAPI)

cd assignment-2-clickhouse-flatfile/backend
pip install -r requirements.txt
uvicorn app:app --reload
Frontend (React)

cd frontend
npm install
npm start
🧪 Edge Cases Tested
Empty CSV uploads

Wrong JWT token for ClickHouse

Type mismatches (string in numeric column)

Non-existent table/column errors

ClickHouse JOIN ingestion (bonus feature)

📷 Screenshots (Optional)
Add UI screenshots or sample terminal output if needed.

🧾 AI Tool Usage
I used ChatGPT to:

Design full backend and frontend architecture

Generate JWT auth handling for ClickHouse

Auto-generate React UI and error handling

Write test flows and sample schemas

See prompts.txt in this directory for full prompt history.
