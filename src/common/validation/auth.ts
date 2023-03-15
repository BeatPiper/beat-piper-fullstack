import z from 'zod';

export const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(16).max(256),
});

export type IUser = z.infer<typeof userSchema>;
