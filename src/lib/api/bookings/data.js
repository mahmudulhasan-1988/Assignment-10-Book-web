import { serverFetch } from '../server';

export const fethMyBooking = async (email) => {
  const result = await serverFetch(`/api/events/booking/${email}`);

  return result;
};
