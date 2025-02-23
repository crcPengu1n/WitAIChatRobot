# **BadgerChat (Voice!) - AI-Powered Chatbot with Wit.AI**

## **1. Introduction**
Welcome to **BadgerChat (Voice!)**, an **AI-powered chatbot** built using **Wit.AI**, **React**, and **Bootstrap**.  
This project extends the **BadgerChat** platform, allowing users to interact via **natural language processing (NLP)** to:
- Retrieve and manage chatrooms 💬  
- Post and fetch messages 📝  
- Register, log in, and manage user accounts 🔑  
- Seamlessly integrate voice input with Wit.AI 🎙️  

✅ **Key Technologies Used:**  
- **React & Bootstrap** (for UI)
- **Wit.AI** (for NLP-based chatbot interactions)
- **REST API** (to manage user authentication and messages)
- **Async/Await Fetch Requests** (for smooth API calls)

---

## **2. Features**
### **🔹 AI-Powered Chatbot (Wit.AI)**
- Handles natural language queries using **pre-trained intents**.
- Can retrieve and post messages using conversational prompts.
- Supports varied responses for a more dynamic experience.

### **🔹 Chatroom Management**
- List all available chatrooms.
- Fetch messages from specific chatrooms.
- Post new messages dynamically.

### **🔹 User Authentication & Account Management**
- Register a new account with **username & PIN validation**.
- Log in and log out with proper session handling.
- Check the current logged-in user.

### **🔹 Smart Assistant Functionalities**
- Provides **context-aware help** based on user queries.
- Uses **synonyms & NLP enhancements** for better understanding.
- Securely handles **sensitive user data** (e.g., masking PINs in chat logs).

---

## **3. Example Use Cases & Chatbot Responses**
### **🔹 1. Get Help (`get_help`)**
> **User:** "I need help"  
> **Chatbot:** "Try asking 'give me a list of chatrooms', or 'register for an account'!"  

The chatbot provides **varied** help suggestions based on **Wit.AI responses**.

---

### **🔹 2. List Available Chatrooms (`get_chatrooms`)**
> **User:** "What chatrooms are there?"  
> **Chatbot:** "You can join: Union South Socials, Picnic Point Pathfinders, Witte Whispers, Lakeshore Lounge."

The chatbot **retrieves chatrooms** dynamically from the API.

---

### **🔹 3. Get Messages (`get_messages`)**
> **User:** "Show me the 3 latest messages in Union South Socials"  
> **Chatbot:**  
> 1️⃣ "User1: Anyone going to the game tomorrow?"  
> 2️⃣ "User2: Count me in!"  
> 3️⃣ "User3: Let's meet at the student union."  

✅ **Dynamic message fetching**  
✅ **Handles optional `X` (number of messages) and `Y` (chatroom)**  
✅ **Default values if omitted (e.g., fetches latest 1 message by default)**  

---

### **🔹 4. Log In (`login`)**
> **User:** "Log me in"  
> **Chatbot:** "You're already logged in! Please log out before logging in again."  

✅ If the user **is logged out**, the chatbot **prompts for username & PIN**.  
✅ If credentials are incorrect, it **returns an error**.  
✅ **Secure PIN handling**: PINs are **masked** in logs as `"Sensitive information redacted!"`.

---

### **🔹 5. Register (`register`)**
> **User:** "I want to register"  
> **Chatbot:** "Enter a username and a 7-digit PIN."

✅ Checks if the user **is already logged in** before registering.  
✅ Prompts for **username & PIN** (must be **exactly 7 digits**).  
✅ If the **username exists**, informs the user.  
✅ If successful, **logs the user in automatically**.

---

### **🔹 6. Who Am I? (`whoami`)**
> **User:** "Who am I logged in as?"  
> **Chatbot:** "You are logged in as `badgerFan23`."  

✅ If **not logged in**, the chatbot **informs the user**.  
✅ Otherwise, **displays the username**.

---

### **🔹 7. Log Out (`logout`)**
> **User:** "Log out"  
> **Chatbot:** "You have been successfully logged out."

✅ If **already logged out**, informs the user.  
✅ Otherwise, **logs out the user and confirms it**.

---

### **🔹 8. Create a Post (`create_message`)**
> **User:** "Post a message in Lakeshore Lounge"  
> **Chatbot:** "What is the title of your post?"  
> **User:** "Late-night study session"  
> **Chatbot:** "What's the content?"  
> **User:** "Anyone want to join a study session at 10PM?"  
> **Chatbot:** "Confirm post? (Yes/No)"  
> **User:** "Yes"  
> **Chatbot:** "Your post has been successfully created in Lakeshore Lounge!"  

✅ If the user is **not logged in**, it prompts them to log in first.  
✅ Requires a **chatroom name** (if omitted, chatbot asks for it).  
✅ Asks for **title & content**, then **confirms before posting**.  

---

## **4. Technical Implementation**
### **🛠️ Backend API**
- Interacts with the **BadgerChat API** to manage:
  - **Chatrooms**
  - **Messages**
  - **User authentication**
- Uses **async/await** for **efficient API requests**.

### **🤖 Wit.AI NLP Agent**
- Handles **natural language queries**.
- Uses **custom intents** (`get_help`, `get_chatrooms`, `get_messages`, `login`, etc.).
- Implements **variable responses** for a **more dynamic chatbot experience**.

### **🛡️ Security Features**
- **PIN masking:** `"Sensitive information redacted!"`  
- **Session-based authentication** using API cookies.  
- **Prevents hardcoded chatroom names in JS** (only in Wit.AI).  

---

## **5. Smart Enhancements**
### ✅ **Dynamic Chatroom Handling**
- Chatrooms **fetched from the API**.
- Users can refer to **chatrooms by synonyms** (e.g., `"Lakeshore"` for `"Lakeshore Lounge"`).

### ✅ **Emote Reactions**
- 🟢 `bucki_success.png` → On **successful login, register, post creation**  
- 🔴 `bucki_error.png` → On **failed login, registration errors**  

### ✅ **Seamless User Experience**
- Supports **conversational flow** (e.g., follows up with questions when necessary).  
- Uses `ofRandom` to **vary responses**, making the chatbot feel **less robotic**.  

---

## **6. Project Deliverables**
### 📌 **1. Upload Your Wit.AI Agent**
- **Export ZIP from Wit.AI:**  
  `Wit.AI Project > Management > Settings > Export Your Data > Download .zip`  
- **Commit & push** this ZIP file to your repository.

### 📌 **2. Submit a Demo Video**
- **Record a full walkthrough** of all chatbot functionalities.
- **Embed as a Kaltura video** in the Canvas submission.

