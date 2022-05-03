import React from 'react';
import { fetchUser } from '../fakeApi'
import { wrapPromise } from '../utils';
const userPromise = fetchUser(1);
const userResource = wrapPromise(userPromise);
function User() {
  let user = userResource.read();
  return (
    <div>{user.id}:{user.name}</div>
  )
}
export default User;