# 📚 ReadRave

**ReadRave** is a full-stack book recommendation and review platform that empowers readers to discover, track, and review books across genres. It integrates AI and external APIs to suggest personalized reads based on individual preferences, making it a smart and interactive companion for every book lover.

## 🚀 Live Demo
👉 [ReadRave Live](https://read-rave.vercel.app)

---

## 🛠️ Tech Stack

- **Frontend**: React.js, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT, bcrypt
- **AI Integration**: Gemini API (personalized book recommendations)
- **External API**: Google Books API (book details, authors, covers, etc.)
- **Image Uploads**: Multer
- **Hosting**: Vercel (frontend), Render (backend)

---

## ✨ Features

- 🔐 **User Authentication** – Secure login/signup using hashed passwords
- 🧠 **AI-Powered Suggestions** – Gemini API recommends books tailored to reader preferences
- 📚 **Book Search & Details** – Integrated with Google Books API for accurate and rich book data
- 📝 **User Reviews** – Submit reviews and ratings for books
- 💾 **Reading History** – Automatically tracks previously selected and reviewed books
- 🖼️ **Profile Picture Uploads** – Upload avatars via Multer
- 📊 **Responsive UI** – Built with TailwindCSS for seamless mobile & desktop experience

---

## 🧠 How It Works

1. Users register or log in to their accounts.
2. An AI chatbot (powered by Gemini API) asks tailored questions to understand preferences.
3. Based on the responses, AI suggests books.
4. Google Books API is used to fetch real-time book information like title, author, cover, and description.
5. Users can read book summaries, leave reviews, and manage their reading history.

---

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/salonijaiswal7412/ReadRave.git
cd ReadRave

# Set up client
cd client
npm install
npm run dev

#In a separate terminal: Set up server
cd server
npm install
npm run dev

```
## Create a .env file in the /server directory and add the following:
```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
```
## 📌 Future Enhancements
📦 Wishlist & bookmarks

🎯 Reading goals & progress tracker

📈 Analytics dashboard for reading trends

📬 Notifications & reading reminders


