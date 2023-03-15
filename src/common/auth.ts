import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verify } from 'argon2';

import { prisma } from './prisma';
import { userSchema } from './validation/auth';

export const nextAuthOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'example@domain.com',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                try {
                    const { email, password } = await userSchema.parseAsync(credentials);

                    const result = await prisma.user.findFirst({
                        where: { email },
                    });

                    if (!result) {
                        return null;
                    }

                    const isValidPassword = await verify(result.password, password);

                    if (!isValidPassword) {
                        return null;
                    }

                    return {
                        id: result.id,
                        email,
                    };
                } catch {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt ({ token, user }) {
            if (user) {
                token.userId = user.id;
                token.email = user.email;
            }

            return token;
        },
        async session ({ session, token }) {
            if (token) {
                session.user.userId = token.userId;
                session.user.email = token.email;
            }

            return session;
        },
    },
    jwt: {
        maxAge: 15 * 24 * 30 * 60, // 15 days
    },
    pages: {
        signIn: '/',
        newUser: '/sign-up',
    },
};
