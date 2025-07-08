const generateBookRecommendations = require("../services/ai.service");

const userSessions = {};

const followUpQuestions = [
  "First things first —what do you want to read? Fiction or Non-fiction?",
  " what kind of story are you in the mood for? (e.g., mystery, romance, sci-fi, fantasy)",
  "What kind of vibe are you feeling today? Something light and cozy, or deep and intense?",
  "How much time do you want to spend with this book? A quick read, a medium ride, or a long, immersive journey?",
  "Do you usually lean towards modern books or the timeless charm of classics?",
  "Are you in the mood for a one-and-done story or a series you can binge through?",
  "Would you call yourself an avid reader, a casual browser, or someone just getting into the reading habit?",
  "Do you prefer character-driven stories, fast-paced plots, or a mix of both?"
];



// const getRecommendations = async (req, res) => {
//     try {
//         const { message, conversationHistory } = req.body;

//         if (!message) {
//             return res.status(400).json({ error: 'Message is required' });
//         }


//         const normalized = message.toLowerCase().trim();
//         const isAffirmative = ['yes', 'sure', 'okay', 'ok', 'yep', 'alright'].includes(normalized);

//         if (isAffirmative) {
//             return res.json({
//                 success: true,
//                 response: response,
//                 timestamp: new Date().toISOString()
//             });
//         }

//         const response = await generateBookRecommendations(message, conversationHistory);

//         res.json({
//             success: true,
//             response: response,
//             timestamp: new Date().toISOString()
//         });
//     } catch (err) {
//         console.error('Chatbot error:', err);
//         res.status(500).json({
//             success: false,
//             error: 'Failed to get book recommendations'
//         });
//     }
// };

const getRecommendations = async (req, res) => {
  try {
    const { message, userId = "default-user" } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const normalized = message.toLowerCase().trim();
    const session = userSessions[userId];

    // Start Q&A flow if user says "yes"
    const isAffirmative = ['yes', 'sure', 'okay', 'ok', 'yep', 'yeah', 'alright'].some(word =>
      normalized.includes(word)
    );

    if (isAffirmative && !session) {
      userSessions[userId] = {
        stepIndex: 0,
        answers: []
      };
      return res.json({
        success: true,
        response: followUpQuestions[0],
        timestamp: new Date().toISOString()
      });
    }

    // If user is in middle of Q&A flow
    if (session) {
      session.answers.push(message); // store previous answer
      session.stepIndex += 1;

      if (session.stepIndex < followUpQuestions.length) {
        // Ask next question
        return res.json({
          success: true,
          response: followUpQuestions[session.stepIndex],
          timestamp: new Date().toISOString()
        });
      } else {
        // All questions answered – call Gemini
        const prompt = `
A user is looking for book recommendations. Here are their preferences:
- Genre: ${session.answers[0]}
- Tone: ${session.answers[1]}
- Length: ${session.answers[2]}
- Style: ${session.answers[3]}
- Type: ${session.answers[4]}
Return the recommendations in this JSON format:
[
  {
    "title": "Book Title",
    "author": "Author Name",
    "description": "Short 1-2 line summary"
  },
  ...
]

Based on this, recommend 3–5 books with title, author, and a short reason for each.
        `;
        delete userSessions[userId]; // clear session
        const aiResponse = await generateBookRecommendations(prompt);

        return res.json({
          success: true,
          response: aiResponse,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Otherwise, just treat like normal open question
    const aiResponse = await generateBookRecommendations(message);
   
    return res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(503).json({
      success: false,
      error: error.message || "Failed to get recommendations. Please try again later.",
    });
  }
};


const startConversation = async (req, res) => {
    try {
        const welcomeMessage = "Wandered the aisles, judged every cover, and still no clue what to read? I got you. I’m your ReadRave book buddy — here to swoop in with the perfect story! Got a genre in mind, or shall I play matchmaker with a few quick questions?";
        res.json({
            success: true,
            response: welcomeMessage,
            Timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error("Start conversation error: ", error);
        res.status(500).json({
            success: false,
            error: 'Failed to start conversation'
        });
    }

};

module.exports = { getRecommendations, startConversation };