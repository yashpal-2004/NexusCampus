# UniVerse: The Ultimate Student Network

UniVerse is a modern, high-energy community platform designed specifically for university students. It combines real-time social interactions, shared ordering, buddy finding, and campus support into a single, high-performance web application.

## 🚀 Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Lucide React (Icons), Motion (Animations)
- **Backend:** Firebase (Firestore, Authentication)
- **AI Integration:** Google Gemini API (Health Assistant)
- **Utilities:** date-fns, clsx, tailwind-merge

## 🛠️ Setup and Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd universe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```
   Ensure `firebase-applet-config.json` is present with your Firebase credentials.

4. **Run the project:**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture Explanation

UniVerse follows a **Serverless Full-Stack Architecture**:
- **Client-Side:** React handles the UI and state management. Real-time listeners (`onSnapshot`) ensure the UI stays in sync with the database without manual refreshes.
- **Backend-as-a-Service (BaaS):** Firebase Firestore acts as the real-time NoSQL database. Firebase Auth handles secure Google-based authentication.
- **Security:** Firestore Security Rules enforce data integrity and ownership at the database level.
- **AI Layer:** Gemini API is integrated directly into the frontend for real-time health assistance.

## 👥 Team Members

- **Lead Developer:** [Your Name]
- **UI/UX Designer:** [Your Name]
- **System Architect:** [Your Name]
