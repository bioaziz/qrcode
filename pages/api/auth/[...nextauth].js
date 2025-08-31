import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import InstagramProvider from "next-auth/providers/instagram";
import { dbConnect } from "@/lib/mongoose";
import User from "@/models/User";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        await dbConnect();
        const email = user?.email || undefined;
        const update = {
          name: user?.name,
          email,
          image: user?.image,
          provider: account?.provider,
          providerAccountId: account?.providerAccountId || account?.providerAccountId || account?.sub || account?.id,
        };

        // Upsert by email when available; otherwise fall back to provider id
        if (email) {
          await User.findOneAndUpdate({ email }, update, { upsert: true, new: true, setDefaultsOnInsert: true });
        } else if (update.provider && update.providerAccountId) {
          await User.findOneAndUpdate(
            { provider: update.provider, providerAccountId: update.providerAccountId },
            update,
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        }

        return true;
      } catch (e) {
        console.error("signIn upsert error", e);
        return false;
      }
    },
    async session({ session }) {
      try {
        await dbConnect();
        if (session?.user?.email) {
          const dbUser = await User.findOne({ email: session.user.email }).lean();
          if (dbUser) {
            session.user.id = dbUser._id.toString();
            session.user.image = dbUser.image || session.user.image;
            session.user.name = dbUser.name || session.user.name;
          }
        }
      } catch (e) {
        // no-op on session fetch errors
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);
