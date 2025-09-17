# 📝 Note Management System

A full-stack **MERN** application that lets users create, edit, pin, and search notes with a built-in **rich text editor**.  
Testing is implemented using **Mocha** and **Jest**, with continuous code quality checks powered by **SonarQube**.

## ✨ Features
- **Rich Text Editor** – Create and format notes with headings, lists, links, and more.  
- **Pin Favorite Notes** – Keep important notes at the top for quick access.  
- **Search by Title** – Instantly find notes by their title keywords.  
- **CRUD Operations** – Create, read, update, and delete notes securely.  
- **Responsive UI** – Works seamlessly across desktop and mobile.

## 🏗️ Tech Stack

| Layer         | Technology |
| ------------- | ---------- |
| **Frontend**  | React, Redux (or Context API), Rich Text Editor (e.g., Draft.js/Quill) |
| **Backend**   | Node.js, Express |
| **Database**  | MongoDB with Mongoose |
| **Testing**   | Mocha, Jest |
| **Code Quality** | SonarQube |
| **Build/Tools** | npm / yarn |

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** ≥ 18  
- **MongoDB** (local or Atlas)  
- **npm** or **yarn**

### Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/note-management-system.git
   cd note-management-system
   # Install server dependencies
2. **Install dependencies**
    npm install
3. **Configure .env file**
    Configure the JWT there and mongoDB URL for connection in index.js file
4. **Run the project**
   ```bash
   #For frontend
   cd frontend
   npm run dev
   #For backend
   cd backend
   node index.js

