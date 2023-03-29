import { type Account } from '@prisma/client';

export const filterAccountForClient = (account: Account) => {
  return {
    id: account.id,
    providerAccountId: account.providerAccountId,
  };
};
