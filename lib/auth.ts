import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
        required: false,
        defaultValue: null,
      },
    },
  },
  plugins: [
    admin({
      defaultRole: "customer",
    }),
  ],
});
