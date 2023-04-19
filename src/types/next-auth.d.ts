import { type DefaultSession } from 'next-auth';

export type UserRole = 'PLUS' | 'USER';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session {
    user: {
      userId: string;
      role: UserRole;
    } & DefaultSession['user'];
  }
  interface User {
    role: UserRole;
  }
}
