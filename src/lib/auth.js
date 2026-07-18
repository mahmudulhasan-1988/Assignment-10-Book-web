import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || 'placeholder-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder-google-client-secret',
    },
    github:{
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    },
    
  },
  user: {
    additionalFields: {
      role: {
        defaultValue: 'attendee',
      },
      isBlocked: {
        defaultValue: false,
      },
      isPremium: {
        defaultValue: false,
      },
    },
  },
});
