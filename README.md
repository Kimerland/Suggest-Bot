# 🎬 Telegram Suggest Bot

![Telegram Suggest Bot](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWR5cnVkamhzcmtvZ2c0ZjA0NmlxazM0dzR0cHU0a3VsMWh2bjNzaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ya4eevXU490Iw/giphy.gif)  

**Suggest Bot** a simple and extensible suggestion bot built using **NestJS**, Prisma, and Telegraf. It allows users to submit anonymous suggestions, which are **reviewed by admins**.

---

## 📌 Tech Stack  
- ⚙️ **NestJS** – Modern backend framework  
- 📦 **Prisma** – ORM for PostgreSQL (or another DB)  
- 🎨 **Telegraf** – Telegram Bot API
- 🐘 **PostgreSQL** – Database 

---

## 📖 Installation  

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/Kimerland/Suggest-Bot.git
cd Suggest-Bot
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Create the .env file
```bash
TELEGRAM_BOT_TOKEN=telegram_bot_token
ADMIN_CHAT_ID=your_id
DATABASE_URL="postgresql://postgres:password@localhost:5432/tg-suggest?schema=public"
```

### 4️⃣ Set up PostgreSQL database
```bash
To run via Docker:
docker run --name pg-bot \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=tg-suggest \
  -p 5432:5432 \
  -d postgres
```

### 5️⃣ Run Prisma migration (creates tables)
```bash
npx prisma migrate dev --name init
```

### 6️⃣ Generate Prisma Client
```bash
npx prisma generate
```

### 7️⃣ Start the bot in dev mode
```bash
npm run start:dev
```

---

### 📢 Contact

```bash
👤 Author: Kimerland
📧 Email: kimerland.project@gmail.com
🐙 GitHub: Kimerland
```

---

### ⭐️ If you like this project, please give it a star!
