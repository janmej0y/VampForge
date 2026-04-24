# 🧛 VampForge

> ✨ Forge your developer identity with one stylish workspace for portfolio building, resume generation, interview practice, and launch-ready presentation.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Status](https://img.shields.io/badge/Status-Building%20Cool%20Stuff-8b5cf6?style=for-the-badge)

## 🚀 What Is VampForge?

VampForge is a modern developer career platform built with **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

It helps developers build a stronger public presence without juggling multiple disconnected tools.

Think of it like this:

- 🧾 Build ATS-friendly resumes
- 🌐 Create polished portfolio pages
- 🎤 Practice live interview flows
- 📊 Track career progress in a dashboard
- 🚀 Preview portfolio deployment experiences

## 🩸 Core Features

### 🏠 Landing Experience
- Premium marketing-style homepage with motion, gradients, and feature previews
- Product storytelling sections for portfolio, resume, interview, and deploy flows

### 📊 Dashboard
- Central workspace for career progress and activity
- Light mode and dark mode support
- Quick navigation into each major tool

### 🌐 Portfolio Builder
- Build a recruiter-friendly developer portfolio
- Add hero content, about section, skills, projects, experience, education, and achievements
- Includes richer preview systems with visual polish and interactive sections

### 🧾 Resume Generator
- Create structured resumes with live preview
- Export-ready flow for PDF, DOCX, and print
- ATS-aware formatting and quality checks

### 🤖 AI Resume Generator
- Uses your Gemini API key to draft role-focused resume content
- Matches resume content to target job descriptions
- Includes review, scoring, and export readiness feedback

### 🔍 Resume Analyzer
- Review resume quality with recruiter-style signals
- Spot missing keywords, weak bullets, and optimization opportunities

### 🎤 Live Interview
- Practice role-specific interview sessions
- Voice/camera-oriented UI flow
- Gemini key is stored locally for interview features

### 🚀 Deploy Portfolio
- Frontend-only deployment-style experience
- Preview launch states, status updates, and portfolio momentum

### ⚙️ Settings
- Local preferences for workspace appearance and interview configuration

## 🧠 Tech Stack

- `Next.js 14`
- `React 18`
- `TypeScript`
- `Tailwind CSS`
- `Framer Motion`
- `Lucide React`
- `jsPDF`
- `docx`
- `three`

## 📁 Project Structure

```text
VampForge/
├── app/                    # App Router pages and feature routes
│   ├── dashboard/
│   ├── deploy/
│   ├── live-interview/
│   ├── login/
│   ├── portfolio/
│   ├── resume-analyzer/
│   ├── resume-generator/
│   └── settings/
├── components/             # Shared UI and layout components
├── lib/                    # Utilities, mock data, config helpers
├── public/                 # Static assets if added later
└── README.md
```

## 🛠️ Getting Started

### 1. Clone the project

```bash
git clone <your-repo-url>
cd VampForge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create a `.env` file in the root folder.

Use these keys if you want to enable login and connected client features:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_GITHUB_CLIENT_ID=
```

Notes:

- 🔐 `.env` is already ignored by Git
- 🤖 The AI resume flow asks for a Gemini API key inside the UI
- 💾 The live interview Gemini key is stored locally in the browser

### 4. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## 📜 Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## 🎨 Design Style

VampForge is intentionally built to feel more cinematic and product-like than a plain dashboard app.

You’ll notice:

- ✨ glassmorphism-inspired surfaces
- 🌈 gradient-driven highlights
- 🎞️ motion-rich transitions
- 🌓 dashboard light/dark theme switching
- 🧪 recruiter-focused UI patterns for career tools

## 🤝 Why This Project Feels Different

Most career tools feel fragmented.

VampForge tries to bring everything into one place:

- one workspace
- one visual system
- one developer identity flow

That means less context switching and more time improving the things recruiters and hiring managers actually see.

## 🧪 Development Notes

- Built with the Next.js App Router
- Uses local fonts from `app/fonts`
- Several flows are frontend-first and presentation-heavy by design
- `npm run lint` is available for code quality checks

## 💡 Future-Friendly Ideas

- 🔐 full production auth flow
- ☁️ saved user data and cloud sync
- 📬 export history and versioning
- 🧠 richer AI feedback systems
- 🌍 public deployment and sharing flow

## 🦇 Cool Factor Section

If your portfolio, resume, and interview prep had a neon startup lab, it would probably look like this.

**VampForge = developer career tools, but make it feel premium.**

## 📬 Contributing

Want to improve the UI, flows, or developer experience?

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Run `npm run lint`
5. Open a pull request

## ⭐ Support

If you like the project:

- ⭐ star the repo
- 🍴 fork it
- 🛠️ build on top of it
- 📣 share it with other developers

---

Made By Janmejoy, motion, and late-night builder energy.
