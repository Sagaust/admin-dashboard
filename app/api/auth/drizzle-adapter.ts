import { Adapter } from "next-auth/adapters";
import { db, users } from "../db"; // Corrected import path

const DrizzleAdapter: Adapter = {
  createUser: async (user) => {
    // Create a new user in your database using Drizzle
    const [newUser] = await db.insert(users).values({
      name: user.name,
      email: user.email,
      username: user.username, // Or any other relevant identifier
    }).returning('*');

    return newUser; 
  },
  getUser: async (id) => {
    // Retrieve a user by their ID using Drizzle
    return await db.select().from(users).where(eq(users.id, id)).first();
  },
  getUserByEmail: async (email) => {
    // Retrieve a user by their email using Drizzle
    return await db.select().from(users).where(eq(users.email, email)).first();
  },
  getUserByAccount: async (providerAccountId) => {
    // Retrieve a user by their provider account ID using Drizzle
    return await db.select().from(users).where(eq(users.providerAccountId, providerAccountId)).first();
  },
  updateUser: async (user) => {
    // Update user details
    return await db.update(users).set({
      name: user.name,
      email: user.email,
      username: user.username
    }).where(eq(users.id, user.id)).returning('*').first();
  },
  deleteUser: async (id) => {
    // Delete a user by their ID using Drizzle
    await db.delete(users).where(eq(users.id, id));
    return null;
  },
  linkAccount: async (account) => {
    // Link a new account to a user
    // Assuming you have an accounts table, adjust accordingly
    const [newAccount] = await db.insert(accounts).values(account).returning('*');
    return newAccount;
  },
  unlinkAccount: async (providerAccountId) => {
    // Unlink an account from a user
    await db.delete(accounts).where(eq(accounts.providerAccountId, providerAccountId));
    return null;
  },
  createSession: async (session) => {
    // Create a new session
    const [newSession] = await db.insert(sessions).values(session).returning('*');
    return newSession;
  },
  getSessionAndUser: async (sessionToken) => {
    // Retrieve a session and user
    const session = await db.select().from(sessions).where(eq(sessions.sessionToken, sessionToken)).first();
    if (!session) return null;
    const user = await db.select().from(users).where(eq(users.id, session.userId)).first();
    return { session, user };
  },
  updateSession: async (session) => {
    // Update a session
    return await db.update(sessions).set(session).where(eq(sessions.sessionToken, session.sessionToken)).returning('*').first();
  },
  deleteSession: async (sessionToken) => {
    // Delete a session
    await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
    return null;
  },
};

export default DrizzleAdapter;
