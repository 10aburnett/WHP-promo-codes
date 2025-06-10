import { DefaultSession } from "next-auth";
import { Role } from '@prisma/client';

declare module "next-auth" {
  /**
   * Extends the built-in session types
   */
  interface Session {
    user?: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  /**
   * Extends the built-in user type
   */
  interface User {
    id: string;
    role: Role;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the built-in JWT token type
   */
  interface JWT {
    id: string;
    role: Role;
  }
} 