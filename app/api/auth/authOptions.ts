import NextAuth from "next-auth";
import DrizzleAdapter from "./drizzle-adapter";

export const authOptions = {
  // ... other NextAuth options
  adapter: DrizzleAdapter,
  providers: [
    // Add your authentication providers here
  ],
};

export default NextAuth(authOptions);
