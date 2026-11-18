# Instructions for the agent

Read this file at the start of every session. Keep it short and correct; update it when the project changes.

## Project
<!-- One or two sentences: what the app does and for whom. Link SPEC.md. -->
- See `SPEC.md` for goals, non-goals and acceptance criteria.
- Club Events is a responsive web application for university students to discover upcoming club events and register for them. Club administrators can create, edit, publish, and cancel events and view registered participants.
- The project must follow the requirements and acceptance criteria in SPEC.md.

## Commands
<!-- How to install, run, test. Keep these exact and working. -->
- Install dependencies:
npm install
- Initialize and seed the database:
npm run db:seed
- Start the application:
npm start
- Run tests:
npm test
- Run the MCP server:
npm run --silent mcp
- Run the Exercise 2 self-check:
node checks/ex2.mjs

## Conventions
<!-- Folder layout, naming, where business rules live, how errors are returned to the client. -->
- Use Node.js 22, Express, SQLite, plain HTML, CSS, and JavaScript.
- Keep HTTP routes in src/routes/.
- Keep business logic in src/services/.
- Keep database access in src/data/.
- Keep authentication and authorization middleware in src/middleware/.
- Keep HTML templates in src/views/.
- Keep frontend styles in public/css/ and client-side JavaScript in public/js/.
- Define database tables and constraints in src/data/schema.sql.
- Use parameterized SQL queries for all database operations.
- Store passwords as bcrypt hashes. Never store plaintext passwords.
- Store secrets and API keys in environment variables. Never commit credentials.
- Validate user input on the server.
- Enforce authentication and authorization on the server, not only in the user interface.
- Prevent duplicate registrations and enforce event capacity using database constraints and  transactions where appropriate.
- Keep route handlers thin: they must call service functions rather than execute SQL directly.
- Use clear, descriptive names and consistent formatting.
- Write automated tests for business rules and acceptance criteria.
- Name acceptance-criterion tests using their IDs, for example test('AC-5 full event rejects registration', ...).
- Update SPEC.md only when implementation reveals a genuine requirement change. Record changes in the Spec vs result section.
- Implement only the requested slice. Do not build future features before the current slice is tested.

## Layers
<!-- Fill in the file or folder for each layer. -->
- Requests arrive two ways and both end in the same place:
- HTTP route handler → service → data access → database
- MCP tool → the same service → data access → database
- A route handler reads the request and turns a result into a status code. A service holds the rules and knows nothing about HTTP or MCP. Only the data layer writes SQL. An MCP tool that talks to the database directly is a second, unguarded way into your data: never add one.
- HTTP routes: src/routes/
- Services: src/services/
- Data access: src/data/
- Database schema: src/data/schema.sql
- Authentication middleware: src/middleware/
- MCP server: mcp-server/

## The model feature
<!-- Provider, env var, and the call site. -->
- The provider is Gemini 2.5 Flash with vision, implemented in src/services/posterAssistanceService.js.
- The key comes from the GEMINI_API_KEY environment variable and is never committed or logged.
- Every call has a timeout and a deterministic fallback, so the app still works when the provider is down or rate-limited.
- The model's suggested event details are validated and reviewed by an administrator before saving.
- Tests never call the provider: they pass in a fake client.

## The MCP server
<!-- Where it lives and how it authenticates. -->
- Lives in mcp-server/, based on the project requirements in SPEC.md.
- Every tool calls a service function; none touches the data layer or the database directly.
- It carries a user and enforces exactly the same authorization rules as the HTTP API.
- Adding a tool means adding a row to the table in SPEC.md.

## Tests and coverage
- Every acceptance criterion in SPEC.md has an id like AC-3 and a test whose title contains that id.
- The coverage gate runs in CI: 100% of the service layer, 80% overall.
- A test is evidence. Changing a test so the code passes destroys the evidence.
- Run tests with npm test and coverage with npm run coverage.

## Always ask before
- deleting files or folders
- editing a migration that has already run
- installing or removing dependencies
- pushing, tagging, or changing CI
- anything that touches secrets or .env
- changing an authentication or authorization rule
- adding, renaming, or removing an MCP tool
- changing a coverage threshold
- sending user data to a third-party model

## Never
- commit secrets, passwords, API keys, or an OAuth client secret
- weaken or delete a test to make it pass
- lower a coverage threshold or switch off a CI job to make the build green
- add an MCP tool that reaches past the service layer
- log a prompt that contains somebody's personal data
