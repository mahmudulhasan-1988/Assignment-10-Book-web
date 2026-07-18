import { serverFetch } from '../server';

export const fethMyPayments = async (email) => {
  const result = await serverFetch(`/api/payment/${email}`);
  return result;
};
