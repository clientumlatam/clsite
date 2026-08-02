/**
 * Vercel serverless entry point.
 *
 * All Express routes are registered at module level in server.ts, so
 * importing it is enough to wire everything up. We just run the DB
 * initialisation (idempotent CREATE TABLE IF NOT EXISTS) on cold start
 * and then export the Express app for Vercel to call as a handler.
 */
import dotenv from 'dotenv';
dotenv.config();

import { app, initUsersTable, initChatbotLeadsTable, initSantiTables } from './server.js';

// Run DB setup sequentially — later tables may depend on earlier ones.
await initUsersTable();
await initChatbotLeadsTable();
await initSantiTables();

export default app;
