import NextAuth from "next-auth";
import Cognito from "next-auth/providers/cognito";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    jwt({ token, user, account }) {
      if (user) {
        token.name = user.name;
      }
      if (account) {
        token.tokenId = account.id_token;
        token.userId = account.providerAccountId;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.name = token.name;
      session.idToken = token.tokenId as string;

      return session;
    },
  },
  providers: [
    Cognito({ authorization: { params: { scope: "openid email phone" } } }),
  ],
});
