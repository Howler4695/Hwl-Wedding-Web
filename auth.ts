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
    jwt({ token, user, account, profile }) {
      if (user) {
        token.name = user.name;
      }
      if (account) {
        token.tokenId = account.id_token;
        token.accessToken = account.access_token;
        token.userId = account.providerAccountId;
      }
      if (profile) {
        token.groups = profile["cognito:groups"];
        token.name = `${profile?.given_name} ${profile?.family_name}`;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.userId as string;
      session.user.name = token?.name;
      session.idToken = token.tokenId as string;
      session.accessToken = token.accessToken as string;
      session.groups = token?.groups as string[];

      return session;
    },
  },
  providers: [
    Cognito({
      authorization: {
        params: { scope: "openid email phone profile" },
      },
    }),
  ],
});
