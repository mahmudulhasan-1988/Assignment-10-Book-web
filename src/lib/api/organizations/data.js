import { serverFetch } from '../server';

export const myOrganization = async (email) => {
  const result = await serverFetch(`/api/organization/${email}`);
  console.log(result, 'my Organization');

  return result;
};
