import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import { setCookie } from 'nookies';

const scopes = [
  'user-top-read',
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-email',
  'user-read-private'
].join(',');
const params = {
  scope: scopes
};

const paramString = new URLSearchParams(params);

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: `https://accounts.spotify.com/authorize?${paramString.toString()}`
    })
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) token.accessToken = account.access_token
      return token
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken
      return session
    }
  },
  secret: process.env.JWT_SECRET,
});
