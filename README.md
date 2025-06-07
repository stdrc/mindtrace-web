# MindTrace

MindTrace is a personal thought-recording application that allows you to log your thoughts with date organization. The application uses a chat-like interface to make recording thoughts quick and intuitive.

## Features

- Login functionality (no registration - user is created in Supabase admin)
- Record thoughts with date selection (today, yesterday, or custom date)
- Chat-like UI with newest thoughts at the bottom
- Edit and delete functionality
- Lazy loading for older thoughts
- Thoughts grouped by date with sequential numbering within each date

## Tech Stack

- Frontend: React, TypeScript, Vite
- Styling: Tailwind CSS
- Backend: Supabase (Auth and Database)
- Hosting: Vercel

## Development Setup

1. **Clone the repository**

2. **Install dependencies**
   ```
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**

   In your Supabase project, create a new table called `thoughts` with the following schema:
   ```sql
   CREATE TABLE thoughts (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id),
     date DATE NOT NULL,
     content TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Indexes for performance
   CREATE INDEX idx_thoughts_user_date ON thoughts(user_id, date);
   CREATE INDEX idx_thoughts_user_created ON thoughts(user_id, created_at);
   ```

5. **Run the development server**
   ```
   npm run dev
   ```

## Deployment

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Set up the environment variables in Vercel
4. Deploy

## Notes

- The date field in the `thoughts` table stores the date without timezone information to ensure it matches the user's mental model of the date.
- Thought numbering is computed on the frontend, not stored in the database.
