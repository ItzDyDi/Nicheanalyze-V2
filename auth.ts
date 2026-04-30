import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

const PLAN_SYNC_INTERVAL = 5 * 60 * 1000; // re-fetch plan depuis la DB toutes les 5 min

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const isValid = await compare(credentials.password as string, user.password);
        if (!isValid) return null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { id: user.id, email: user.email, name: user.name ?? undefined, image: user.image ?? undefined, plan: (user as any).plan ?? "free" };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/login" },
  callbacks: {
    async jwt({ token, user, trigger, session: updateData }) {
      // ── Nouveau login : on initialise tout depuis l'objet user
      if (user) {
        token.id          = user.id;
        token.image       = (user as { image?: string }).image ?? null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.plan        = (user as any).plan ?? "free";
        token.planSyncedAt = Date.now();
      }

      // ── update() appelé côté client (ex: changement avatar/nom)
      if (trigger === "update") {
        if (updateData?.image !== undefined) token.image = updateData.image;
        if (updateData?.name  !== undefined) token.name  = updateData.name;
        // Forcer une resync du plan si demandé explicitement
        if (updateData?.forcePlanSync) token.planSyncedAt = 0;
      }

      // ── Re-sync du plan depuis la DB toutes les 5 min
      // Évite d'afficher un vieux plan après un changement d'abonnement
      const syncedAt = (token.planSyncedAt as number) ?? 0;
      if (token.id && Date.now() - syncedAt > PLAN_SYNC_INTERVAL) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { plan: true, name: true, image: true },
          });
          if (dbUser) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            token.plan        = (dbUser as any).plan ?? "free";
            token.name        = dbUser.name ?? token.name;
            token.image       = dbUser.image ?? token.image;
            token.planSyncedAt = Date.now();
          }
        } catch {
          // En cas d'erreur DB on garde le plan en cache
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id               = token.id as string;
        (session.user as { image?: string | null }).image  = token.image as string | null;
        (session.user as { plan?: string }).plan           = (token.plan as string) ?? "free";
      }
      return session;
    },
  },
});
