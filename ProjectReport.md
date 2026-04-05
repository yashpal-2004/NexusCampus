# Project Report: UniVerse Student Network

## 1. Problem Statement
University students often face challenges in campus communication, finding partners for activities, coordinating shared orders (like Blinkit), and accessing quick medical or administrative support. Existing solutions are fragmented (WhatsApp groups, manual registers). UniVerse aims to centralize these needs into a modern, real-time platform.

## 2. System Design Optimization
- **Scalability:** Leveraged Firebase's NoSQL architecture to handle high-frequency read/write operations for the live feed.
- **Performance:** Implemented real-time data synchronization using WebSockets (via Firestore `onSnapshot`), reducing the need for expensive polling.
- **Architecture:** Decoupled UI components from data logic using React Hooks and Context API for better maintainability.

## 3. OOP Concepts Applied
- **Encapsulation:** Data models are defined as strict TypeScript interfaces, encapsulating the properties of each entity (e.g., `StudentQuery`, `BlinkitRequest`).
- **Abstraction:** The `NotificationsManager` and `Firebase` service layer abstract complex logic away from the UI components.
- **Polymorphism:** The `Feed` component handles different types of content (Queries and Blinkit Requests) through a unified rendering interface.

## 4. Design Patterns
- **Observer Pattern:** Used Firestore's real-time listeners to notify the UI of data changes.
- **Provider Pattern:** Implemented `NotificationsProvider` to manage global state across the application.
- **Factory Pattern:** (Implicit) The creation of notification objects follows a consistent structure through the `addNotification` function.

## 5. SOLID Principles
- **Single Responsibility:** Each component (e.g., `QueryCard`, `Sidebar`) has a single, well-defined purpose.
- **Open/Closed:** The `Layout` component is open for extension (new tabs) but closed for modification of its core structure.
- **Liskov Substitution:** Component props follow strict typing to ensure they can be replaced or extended without breaking the UI.
- **Interface Segregation:** Types are split into specific interfaces (`UserProfile`, `BuddyPost`) rather than one giant object.
- **Dependency Inversion:** High-level components depend on abstractions (Context/Hooks) rather than concrete implementations.

## 6. UML Diagrams (Conceptual)

### Class Diagram
- `User` (uid, email, displayName)
- `Query` (id, content, authorUid, votes)
- `BlinkitRequest` (id, item, expiresAt, joinedUsers)
- `Notification` (id, recipient, message)

### Use Case Diagram
- **Student:** Post Query, Upvote/Downvote, Join Blinkit Order, Find Buddy, Chat with Health AI.
- **Admin:** Resolve Queries, Manage Support Contacts.

### Sequence Diagram (Blinkit Workflow)
1. User clicks "Post Blinkit Req".
2. Modal opens -> User enters item & window.
3. App calls `addDoc` to Firestore.
4. Firestore triggers `onSnapshot` for all clients.
5. Other users see the request and click "Join".
6. `updateDoc` adds user to `joinedUids`.

## 7. Test Cases
- **Auth:** Verify only university-suffix emails can access (Logic implemented).
- **Real-time:** Post a query on one tab, verify it appears on another instantly.
- **Blinkit Timer:** Verify the "Join" button disables after the window expires.
- **AI Assistant:** Verify Gemini returns medical advice with a disclaimer.
