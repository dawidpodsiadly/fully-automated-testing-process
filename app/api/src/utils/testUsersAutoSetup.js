const UserModel = require('../models/User');

const usersToCreate = [
  { name: 'playwright', surname: 'playwright', email: 'playwright@tests.com', isActivated: true, isAdmin: true },
  { name: 'api admin', surname: 'tester', email: 'apitesteradmin@tests.com', isActivated: true, isAdmin: true },
  { name: 'api not admin', surname: 'tester', email: 'apitesternotadmin@tests.com', isActivated: true, isAdmin: false },
  { name: 'api deactivated', surname: 'tester', email: 'apitesterdeactivated@tests.com', isActivated: false, isAdmin: false },
];

const PASSWORD = 'chocolate';

const createTestUsers = async () => {
  try {
    for (const userData of usersToCreate) {
      const existingUser = await UserModel.findOne({ email: userData.email });

      if (!existingUser) {
        await UserModel.create({ ...userData, password: PASSWORD });
        console.log(`User ${userData.email} created`);
      } else {
        console.log(`User ${userData.email} already exists`);
      }
    }
  } catch (error) {
    console.error('Error creating users:', error.message);
  }
};

module.exports = { createTestUsers };
