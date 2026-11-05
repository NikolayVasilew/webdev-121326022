# Club Events

<!-- Exercise 2. Write the non-goals first. Every acceptance criterion must be checkable in under a minute.
     Keep these headings exactly as they are: the self-checks look for them by name.
     The full target is on the course site under Resources → The course project. -->

## Project option
<!-- One line: lab booking, study groups, club events, or the own project the lecturer approved. -->

Club events.

## Goals
- Allow students to discover upcoming events organized by the student club and view event details.
- Allow registered users to sign up for events and cancel their registrations.
- Allow club administrators to create, edit, publish, and cancel events.
- Prevent registrations when an event reaches its maximum capacity.
- Allow administrators to view the list of registered participants for each event.

## Non-goals
- No payments: all club events are free to attend.
- No email or push notifications: users check event information on the website.
- No native mobile application: the project provides a responsive web application only.
- No ticket generation or QR-code check-in.
- No automated event recommendations or social networking features.

## Constraints
- The application must be a responsive web application accessible on desktop and mobile browsers.
- Users must authenticate before registering for events.
- Each event must have a title, description, date, time, location, and maximum capacity.
- An authenticated user can register only once for the same event.
- The system must not allow registrations after an event reaches its maximum capacity.
- Only administrators can create, edit, publish, or cancel events.
- The application must use a persistent database to store users, events, and registrations.
- The application must use Node.js 22, Express, SQLite, and plain HTML, CSS, and JavaScript.
- Database queries must use parameterized statements.
- Passwords must be stored as secure hashes, never as plaintext.
- Secrets and API keys must be stored in environment variables.

## The model feature
- Model: Gemini 2.5 Flash with vision, called from the event poster assistance service.
- Input: An event poster image uploaded by an administrator when creating an event.
- Output: Suggested event title, date, time, location, and description, displayed in the event creation form for the administrator to review and edit.
- When it fails: If the API key is missing, the provider times out, returns a rate limit error (429), or produces invalid information, the form remains usable and the administrator can enter all event details manually. No event is saved automatically.

## Auth
- Local: Email and password registration and sign-in. Passwords are stored only as bcrypt hashes, never as readable text.
- Provider: Sign in with Google using the OAuth 2.0 authorization-code flow handled on the server.
- Linking: A Google account is linked to an existing local account only when Google confirms that the email address is verified and matches the local account. Unverified email addresses are never automatically linked. Users can also connect Google after signing in with their password.
- Authorization: Only authenticated users can register for events. Only administrators can manage events and view participant lists.


## MCP tools
<!-- At least three tools your own MCP server exposes over this project's data.
     Each tool calls the same service functions the HTTP API calls, so the same rules apply.
     A description shorter than 20 characters is not a description. -->
Tool

What it does

Who may call it

list_upcoming_events

Returns published upcoming club events with dates, locations, and available places so users can discover activities.

Anyone

get_event_details

Returns the complete details of a specific published event using its event ID, including capacity and registration information.

Anyone

search_events

Searches published club events by title or keyword and returns matching event summaries with dates and locations.

Anyone

register_for_event

Registers the authenticated user for an event if places are available and the user is not already registered.

Authenticated users

cancel_event_registration

Cancels the authenticated user's existing registration and makes the place available again.

Authenticated users


## UI
- Stack: Node.js 22 with Express for the backend, SQLite for persistent storage, and plain HTML, CSS, and JavaScript for the frontend.
- Screens:
Login and registration page.
Upcoming events list page.
Event details page.
Event creation and editing page for administrators.
Event participant list for administrators.
User account page with registration management.
- The interface must be responsive and usable on desktop and mobile browsers.
- Every screen must provide appropriate loading, empty, error, and success states.
- UI checklist: docs/UI.md

## Architecture
<!-- Exercise 3. One request traced through every layer, naming the file for each one,
     plus one place where your own code does not match this layering. -->
HTTP entry point: src/server.js starts the Express application.
Routing layer: src/routes/events.js handles event listing, details, and registration HTTP requests.
Authentication layer: src/middleware/auth.js verifies the user's session and role.
Business logic layer: src/services/eventService.js implements event discovery, registration, cancellation, and capacity rules.
Data access layer: src/data/eventRepository.js executes parameterized SQLite queries.
Database schema: src/data/schema.sql defines users, events, and registrations.
Views: src/views/ contains the HTML templates for the event list and event details.
Frontend assets: public/css/ and public/js/ contain styles and client-side behavior.
One request traced through the layers: GET /events → src/routes/events.js → src/services/eventService.js → src/data/eventRepository.js → SQLite → event list view.
Potential layering violation to check: route handlers must not execute SQL queries directly; they must call the service layer.

## Acceptance criteria
<!-- Every criterion carries an id. A test proves it by naming that id in its title, for example
     test('AC-3 a booking that overlaps another is refused with 409', ...).
     Say who acts, what they see, and what must be true in the database. -->
[AC-1] A visitor who opens /events sees a list of upcoming published events with their title, date, location, and available places.
[AC-2] A visitor who selects an event sees its full description, date, time, location, and maximum capacity.
[AC-3] A user who enters a valid email and password can sign in and access the events list.
[AC-4] A signed-in user who registers for an event with available places sees a confirmation message and the number of available places decreases by one.
[AC-5] A signed-in user who tries to register for a full event sees the message "This event is full" and no registration is created.
[AC-6] A signed-in user who cancels an existing registration sees a confirmation message and the number of available places increases by one.
[AC-7] An administrator who creates or edits an event sees the updated event information in the events list.
[AC-8] An administrator who opens an event's participant list sees the names and email addresses of its registered users.
[AC-9] A user who tries to register twice for the same event receives a clear message, and only one registration exists in the database.
[AC-10] A non-administrator who attempts to create, edit, publish, or cancel an event is denied access, and the event remains unchanged.
[AC-11] An administrator who uploads a valid event poster receives suggested event details in the form and can edit them before saving.
[AC-12] When the model feature fails, the administrator can manually enter and save event details without losing the form.

### Slice 1: sign-in and the upcoming events list
[AC-13] A visitor who opens /events without signing in is redirected to /login and cannot see the events list.
[AC-14] A user who signs in with a seeded account sees the three seeded upcoming events at /events, each displaying its title, date, location, and number of available places.
[AC-15] A seeded administrator who signs in successfully sees the same upcoming events list.
[AC-16] When an event is deleted from the database and the user reloads /events, that event no longer appears in the list.


## Traceability
<!-- Filled in from Exercise 3 onward: each AC id, and the test that names it. -->
Criterion
Test
AC-1
test('AC-1 upcoming published events are listed', ...)
AC-2
test('AC-2 event details show complete information', ...)
AC-3
test('AC-3 valid credentials allow sign-in', ...)
AC-4
test('AC-4 registration reduces available places', ...)
AC-5
test('AC-5 full event rejects registration', ...)
AC-6
test('AC-6 cancellation restores available places', ...)
AC-7
test('AC-7 administrator event changes appear in list', ...)
AC-8
test('AC-8 administrator can view participants', ...)
AC-9
test('AC-9 duplicate registration is prevented', ...)
AC-10
test('AC-10 non-administrator event management is denied', ...)
AC-11
test('AC-11 poster assistance suggests event details', ...)
AC-12
test('AC-12 model failure allows manual event creation', ...)
AC-13
test('AC-13 unauthenticated visitor is redirected', ...)
AC-14
test('AC-14 seeded user sees three upcoming events', ...)
AC-15
test('AC-15 seeded administrator sees upcoming events', ...)
AC-16
test('AC-16 deleted event disappears after reload', ...)

## Spec vs result
<!-- After the agent builds the slice: which criteria passed, which it missed or reinterpreted, and what you changed in this spec because of it. -->
Passed: To be completed after manually testing Slice 1.
Missed: To be completed after manually testing Slice 1.
Changed: To be completed after manually testing Slice 1.
