import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const { signIn, signUp, signOut, useSession, updateUser } = createAuthClient({
  plugins: [
    adminClient(),
    inferAdditionalFields<typeof auth>(),
  ],
});
