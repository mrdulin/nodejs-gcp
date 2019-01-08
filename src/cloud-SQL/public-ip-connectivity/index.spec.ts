import { findAllUsers } from './';

describe('findAllUsers', () => {
  it('t1', async () => {
    const users = await findAllUsers();
    console.log('users: ', users);
    // expect().toBe();
  });
});
