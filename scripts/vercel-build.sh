#!/bin/sh
# Generate .env from Vercel environment variables for Metro bundler
echo "EXPO_PUBLIC_SUPABASE_URL=$EXPO_PUBLIC_SUPABASE_URL" > .env
echo "EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY" >> .env
echo "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=$EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID" >> .env
echo "--- .env contents ---"
cat .env
echo "--- end .env ---"
npm run build:web
