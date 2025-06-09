
export const mockPrompts = {
  enhanced: "Create a comprehensive and detailed guide for beginner web developers that covers HTML, CSS, JavaScript fundamentals, best practices for responsive design, accessibility considerations, and modern development workflows including version control with Git.",
  original: "make a guide for web development"
};

export const mockResume = {
  improved: `PROFESSIONAL SUMMARY
Results-driven Software Engineer with 5+ years of experience developing scalable web applications and leading cross-functional teams. Proven expertise in JavaScript, React, Node.js, and cloud technologies. Demonstrated ability to deliver high-quality solutions that improve user experience and drive business growth.

CORE COMPETENCIES
• Full-Stack Development (React, Node.js, MongoDB)
• Cloud Architecture (AWS, Docker, Kubernetes) 
• Team Leadership & Agile Methodologies
• Performance Optimization & Code Quality
• API Design & Database Management`,
  original: `I am a software engineer with some experience in web development. I know JavaScript and React. I have worked on some projects.`
};

export const mockMoodAnalysis = {
  emotion: "Joy",
  confidence: 85,
  breakdown: {
    joy: 85,
    sadness: 5,
    anger: 3,
    fear: 2,
    surprise: 5
  }
};

export const mockChatResponses = [
  "That's an interesting question! Based on current trends, I'd say...",
  "I understand your concern. Let me break this down for you...",
  "Great point! Here's another perspective to consider...",
  "I'd be happy to help you with that. The key factors are...",
  "That reminds me of a similar situation where..."
];

export const mockQuotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle"
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins"
  }
];

export const mockJsonData = {
  name: "John Doe",
  age: 30,
  email: "john.doe@example.com",
  address: {
    street: "123 Main St",
    city: "New York",
    zipCode: "10001"
  },
  skills: ["JavaScript", "React", "Node.js"],
  isActive: true
};

export const mockJwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export const mockJwtDecoded = {
  header: {
    alg: "HS256",
    typ: "JWT"
  },
  payload: {
    sub: "1234567890",
    name: "John Doe",
    iat: 1516239022
  },
  signature: "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
};

export const mockSpeedTestResult = {
  download: "85.4",
  upload: "23.7",
  ping: "12",
  server: "New York, NY"
};
