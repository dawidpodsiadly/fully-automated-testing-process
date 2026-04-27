import {expect} from '@playwright/test';
import {test} from '../../fixtures/page-object.fixture';
import {generateRandomApiUserData} from '../../api/users/users.factory';
import {usersApi} from '../../api/users/users.api';
import {generateRandomUserData} from '../../factories/user.factory';
import {randomUtil} from '../../utils/random.utils';
import {logoutAndLogin, performTestInitialization} from '../../utils/tests.utils';

let testUser: {id: string; email: string; password: string};

test.describe('User Table', () => {
  test.beforeEach(async ({page}) => {
    testUser = await performTestInitialization(page);
  });

  test('Update Action - Update User to Admin/Not Admin', async ({page, userTable, userUpdate, userDetails}) => {
    const apiUserData = generateRandomApiUserData();
    const createdUser = await usersApi.createUser(apiUserData);

    /** Change to not admin **/
    const userRow = await userTable.getRowByEmail(createdUser.email);
    await userRow.goToUpdateUserView();
    await userUpdate.updateUserForm({isAdmin: false});
    await logoutAndLogin(page, createdUser.email, createdUser.password);
    await userDetails.isVisible();

    /** Change to admin **/
    await logoutAndLogin(page, testUser.email, testUser.password, false);
    await userTable.searchByEmail(createdUser.email);
    await userRow.goToUpdateUserView();
    await userUpdate.updateUserForm({isAdmin: true});

    await logoutAndLogin(page, createdUser.email, createdUser.password);
    await userTable.isVisible();
  });

  test('Update Action - Update User to Activated/Deactivated', async ({page, userTable, userUpdate, loginPage}) => {
    const apiUserData = generateRandomApiUserData();
    const createdUser = await usersApi.createUser(apiUserData);

    /** Change to deactivated **/
    const userRow = await userTable.getRowByEmail(createdUser.email);
    await userRow.goToUpdateUserView();
    await userUpdate.updateUserForm({isActivated: false});

    await logoutAndLogin(page, createdUser.email, createdUser.password);
    await loginPage.expectError('Your account has been deactivated. Please contact your administrator.');

    /** Change to activated **/
    await loginPage.login(testUser.email, testUser.password);
    await userTable.searchByEmail(createdUser.email);
    await userRow.goToUpdateUserView();
    await userUpdate.updateUserForm({isActivated: true});

    await logoutAndLogin(page, createdUser.email, createdUser.password);
    await userTable.isVisible();
  });

  test('Update Action - Update User by Only the Required Fields Without changing the Password and Check if the User Can Log in with the Old Password', async ({
    page,
    userUpdate,
    userTable,
    userDetails,
  }) => {
    const apiUserData = generateRandomApiUserData(false, false);
    const createdUser = await usersApi.createUser(apiUserData);
    const updatedUserData = {
      name: randomUtil.randomName(),
      surname: randomUtil.randomName(),
      email: randomUtil.randomEmail(),
      isActivated: true,
      isAdmin: true,
    };

    const userRow = await userTable.getRowByEmail(createdUser.email);
    await userRow.updateButton.click();
    await userUpdate.clearAllInputs();
    await userUpdate.updateUserForm(updatedUserData);

    const updatedUserRow = await userTable.getRowByEmail(updatedUserData.email);
    await updatedUserRow.checkUserData(updatedUserData);
    await updatedUserRow.userNameText.click();
    await userDetails.checkUserData(updatedUserData);

    /** User should log in with old password **/
    await logoutAndLogin(page, updatedUserData.email, createdUser.password);
    await userTable.isVisible();
  });

  test('Update Action - Validate Update User Form Inputs', async ({userUpdate, userTable}) => {
    const updatedUserData = generateRandomUserData();
    const contractStartTime = randomUtil.randomDate();
    const contractEndTime = randomUtil.randomYoungerDate(contractStartTime);
    const apiUserData = generateRandomApiUserData(false, false);
    const createdUser = await usersApi.createUser(apiUserData);

    const userRow = await userTable.getRowByEmail(createdUser.email);
    await userRow.updateButton.click();

    /** Required inputs **/
    await userUpdate.clearAllInputs();
    await userUpdate.changePasswordCheckbox.setChecked(true);
    await userUpdate.submitForm();
    await userUpdate.expectError('User Name is required');
    await userUpdate.expectError('Surname is required');
    await userUpdate.expectError('Email is required');
    await userUpdate.expectError('Password is required');

    /** Password must be at least 9 characters long && passwords must match **/
    await userUpdate.updateUserForm({
      name: updatedUserData.name,
      surname: updatedUserData.surname,
      email: updatedUserData.email,
    });
    await userUpdate.passwordInput.fill(randomUtil.randomName(8));
    await userUpdate.submitForm();
    await userUpdate.expectError('Password must be at least 9 characters long');
    await userUpdate.expectError('Passwords must match');

    /** Your phone number does not exist **/
    await userUpdate.updateUserForm({phoneNumber: randomUtil.randomName(), password: updatedUserData.password});
    await userUpdate.expectError('Your phone number does not exist');

    /** Salary must be a number **/
    await userUpdate.updateUserForm({
      contract: {salary: randomUtil.randomName()},
      phoneNumber: updatedUserData.phoneNumber,
    });
    await userUpdate.expectError('Salary must be a number');

    /** Salary has to be without minus sign **/
    await userUpdate.updateUserForm({contract: {salary: `-${randomUtil.randomStringNumber(4)}`}});
    await userUpdate.expectError('Salary must be a number');

    /** End date must be after start date **/
    await userUpdate.updateUserForm({
      contract: {
        startTime: contractEndTime,
        endTime: contractStartTime,
        salary: randomUtil.randomInt().toString(),
      },
    });
    await userUpdate.expectError('End date must be after start date');

    /** Email already exists **/
    await userUpdate.updateUserForm({
      email: testUser.email,
      contract: {startTime: contractStartTime, endTime: contractEndTime},
    });
    await userUpdate.expectError('Email already exists');
  });

  test('Update Action - Update User Password and Log in with Updated Password', async ({
    page,
    userUpdate,
    userTable,
    userDetails,
  }) => {
    const apiUserData = generateRandomApiUserData(false, false);
    const createdUser = await usersApi.createUser(apiUserData);
    const updatedUserData = generateRandomUserData();

    const userRow = await userTable.getRowByEmail(createdUser.email);
    await userRow.updateButton.click();
    await userUpdate.clearAllInputs();
    await userUpdate.updateUserForm(updatedUserData);

    /** User should be updated correctly **/
    const updatedUserRow = await userTable.getRowByEmail(updatedUserData.email);
    await updatedUserRow.checkUserData(updatedUserData);
    await updatedUserRow.userNameText.click();
    await userDetails.checkUserData(updatedUserData);

    /** User should log in with new credentials **/
    await logoutAndLogin(page, updatedUserData.email, updatedUserData.password);
    await userTable.isVisible();
  });

  test('Table - Mass Removal of Users', async ({userTable}) => {
    const apiUserData1 = generateRandomApiUserData();
    const createdUser1 = await usersApi.createUser(apiUserData1);
    const apiUserData2 = generateRandomApiUserData();
    const createdUser2 = await usersApi.createUser(apiUserData2);

    const userRow1 = await userTable.getRowByEmail(createdUser1.email);
    await userRow1.userCheckbox.click();
    const userRow2 = await userTable.getRowByEmail(createdUser2.email);
    await userRow2.userCheckbox.click();

    await userTable.deleteSelectedUsersButton.click();
    await userTable.deleteUserDialog.confirmDelete();

    await userTable.searchByEmail(createdUser1.email);
    await userRow1.isVisible(false);
    await userTable.searchByEmail(createdUser2.email);
    await userRow2.isVisible(false);
  });

  test('Activate/Deactivate Action - Activate/Deactivate User', async ({page, userTable, loginPage}) => {
    const apiUserData = generateRandomApiUserData();
    const createdUser = await usersApi.createUser(apiUserData);

    /** Deactivate user **/
    const userRow1 = await userTable.getRowByEmail(createdUser.email);
    await userRow1.activationButton.click();
    await logoutAndLogin(page, createdUser.email, createdUser.password);
    await loginPage.expectError('Your account has been deactivated. Please contact your administrator.');

    /** Activate user **/
    await loginPage.login(testUser.email, testUser.password);
    await userTable.searchByEmail(createdUser.email);
    await expect(userRow1.userStatusText).toHaveClass('text-danger');
    await userRow1.activationButton.click();

    await logoutAndLogin(page, createdUser.email, createdUser.password);
    await userTable.searchByEmail(createdUser.email);
    await expect(userRow1.userStatusText).toHaveClass('text-success');
  });

  test('Delete Action - Delete User', async ({page, userTable, loginPage}) => {
    const apiUserData = generateRandomApiUserData();
    const createdUser = await usersApi.createUser(apiUserData);

    const userRow1 = await userTable.getRowByEmail(createdUser.email);
    await userRow1.deleteButton.click();
    await userTable.deleteUserDialog.confirmDelete();
    await userTable.searchByEmail(createdUser.email);
    await userRow1.isVisible(false);

    await logoutAndLogin(page, createdUser.email, createdUser.password);
    await loginPage.expectError('Invalid email or password.');
  });
});
