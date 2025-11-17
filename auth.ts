import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import Cognito from "next-auth/providers/cognito";
import { redirect } from "next/navigation";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.name = user.name;
      }
      if (account) {
        token.tokenId = account.id_token;
        token.accessToken = account.access_token;
        token.userId = account.providerAccountId;
        token.expires_at = account.expires_at;
        token.refresh_token = account.refresh_token;
      }
      if (profile) {
        token.groups = profile["cognito:groups"];
        token.name = `${profile?.given_name} ${profile?.family_name}`;
      }

      if (!token.expires_at) {
        return await refreshCognitoAccessToken(token);
      }

      const now = Date.now();
      if (now < Number(token.expires_at) * 1000) {
        return token;
      }

      return await refreshCognitoAccessToken(token);
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

async function refreshCognitoAccessToken(token: JWT): Promise<JWT> {
  try {
    if (!token.refresh_token) {
      throw new Error("Missing refresh_token");
    }

    const issuer = process.env.AUTH_COGNITO_ISSUER;
    const clientId = process.env.AUTH_COGNITO_ID;
    const clientSecret = process.env.AUTH_COGNITO_SECRET;

    if (!issuer || !clientId) {
      throw new Error("NOT DEFINED AUTH_COGNITO_ISSUER / AUTH_COGNITO_ID");
    }

    const response = await fetch(`${issuer.replace(/\/$/, "")}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: clientId,
        ...(clientSecret ? { client_secret: clientSecret } : {}),
        refresh_token: token.refresh_token as string,
      }),
    });

    const tokens = await response.json();

    if (!response.ok) {
      throw new Error("Failed to refresh access token");
    }

    return {
      ...token,
      access_token: tokens.access_token,
      expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
      refresh_token: tokens.refresh_token ?? token.refresh_token,
      error: undefined,
    };
  } catch (error) {
    console.error("Error refreshing Cognito access token:", error);
    return {
      ...token,
      error: "RefreshTokenError",
    } as JWT;
  }
}
