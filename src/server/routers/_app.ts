import { TRPCError } from '@trpc/server';
import { hash } from 'argon2';

import { procedure, router } from '../trpc';
import { userSchema } from '@/common/validation/auth';

export const appRouter = router({
  signup: procedure.input(userSchema).mutation(async ({ input, ctx }) => {
    const { email, password } = input;

    const exists = await ctx.prisma.user.findFirst({
      where: { email },
    });

    if (exists) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'User already exists.',
      });
    }

    const hashedPassword = await hash(password);

    const result = await ctx.prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return {
      status: 201,
      message: 'Account created successfully',
      result: result.email,
    };
  }),
});

export type AppRouter = typeof appRouter;
