import { serverFetch } from '../server';

export const myEvents = async (email) => {
  //   console.log(email, 'email');

  const result = await serverFetch(`/api/events/${email}`);
  //   console.log(result, 'my events');

  return result;
};
export const fetchEvents = async (query) => {
  const result = await serverFetch(`/api/events?${query.toString()}`);

  return result;
};
export const fetchFeaturedEvents = async () => {
  const result = await serverFetch(`/api/events/featured`);

  return result;
};
