import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.userId = account.id || null; // Ensure userId is available, fallback to null
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken || null; // Ensure accessToken is available
      session.user.id = token.userId; // Attach user ID to session
      return session;
    },
  },
};

export const handler = (req, res) => {
  NextAuth(req, res, authOptions);
};

