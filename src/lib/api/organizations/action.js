'use server';

import { serverMutation } from '../server';

export const addOrganization = async (data) => {
  const resData = await serverMutation('/api/organizations', 'POST', data);
  return resData;
};
export const updateOrg = async (data, id) => {
  //   console.log(data, id, 'Update Org');

  const resData = await serverMutation(`/api/organizations/${id}`, 'PATCH', data);
  return resData;
};
