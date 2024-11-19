NotImpactCoin
NotImpactCoin is a gamified decentralized application (dApp) where users can participate in engaging games, boost their multipliers, and earn rewards. This application integrates with Telegram bots for interactive user experiences and is built with modern web technologies.

Features
🕹️ Games: Coin Flip, Dice Roll, Slot Machine, and Farm Points.
💰 Boosts: Purchase multipliers and auto-clickers to maximize earnings.
📊 Stats: Track user progress, rewards, and achievements.
🤝 Referral System: Invite friends to earn additional rewards.
🌐 Telegram Bot Integration: Stay connected and interact via Telegram.
🎨 Responsive UI: Built with Tailwind CSS for a seamless user experience.
Tech Stack
Frontend: React, Next.js, TypeScript, Tailwind CSS
Backend: Node.js, Express.js
Telegram Bot: node-telegram-bot-api
Deployment: Vercel
Setup Instructions
Prerequisites
Ensure you have the following installed:
Node.js (v18 or higher)
Git
Clone this repository:
bash
Copy code
git clone https://github.com/bixdigital/notimpactcoin.git
Navigate to the project directory:
bash
Copy code
cd notimpactcoin
Installation
Install project dependencies:
bash
Copy code
npm install
Add your environment variables:
Create a .env file in the root directory.
Add your Telegram bot token:
env
Copy code
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
Running Locally
Start the development server:
bash
Copy code
npm run dev
Visit the application in your browser at http://localhost:3000.
Deploying to Vercel
Push your changes to GitHub:
bash
Copy code
git push origin main
Deploy to Vercel:
Link your GitHub repository to Vercel.
Add the environment variable TELEGRAM_BOT_TOKEN in your Vercel project settings.
Commands
Command	Description
npm run dev	Start the development server
npm run build	Build the project for production
npm run start	Start the production server
npm run lint	Run the linter
Contribution Guidelines
We welcome contributions! Please follow these steps:

Fork the repository.
Create a new branch for your feature:
bash
Copy code
git checkout -b feature-name
Commit your changes:
bash
Copy code
git commit -m "Add new feature"
Push to your forked repository:
bash
Copy code
git push origin feature-name
Open a Pull Request on GitHub.
License
This project is licensed under the MIT License.

