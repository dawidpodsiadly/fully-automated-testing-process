import {test} from '../../fixtures/page-object.fixture';
import {generateRandomApiUserData} from '../../api/users/users.factory';
import {usersApi} from '../../api/users/users.api';
import {generateRandomUserData} from '../../factories/user.factory';
import {logoutAndLogin, performTestInitialization} from '../../utils/tests.utils';
import {NavigationPaths, navigationService} from '../../services/navigation.service';
import {UserData} from '../../types/user.types';
import {randomUtil} from '../../utils/random.utils';

test.describe('User Creator', () => {
  test.beforeEach(async ({page}) => {
    await performTestInitialization(page);
  });

  test('Create Activated Admin User', async ({page, userCreator, userTable, userDetails}) => {
    const userData = generateRandomUserData(true, true);
    await userTable.userHeader.addUserButton.click();
    await userCreator.fillAndSubmitUserForm(userData);

    const userRow = await userTable.getRowByEmail(userData.email);
    await userRow.checkUserData(userData);

    await userRow.userNameText.click();
    await userDetails.checkUserData(userData);

    await logoutAndLogin(page, userData.email, userData.password);
    await userTable.isVisible();
  });

  test('Create Not Activated Admin User', async ({page, userCreator, userTable, userDetails, loginPage}) => {
    const userData = generateRandomUserData(true, false);
    await userTable.userHeader.addUserButton.click();
    await userCreator.fillAndSubmitUserForm(userData);

    const userRow = await userTable.getRowByEmail(userData.email);
    await userRow.checkUserData(userData);

    await userRow.userNameText.click();
    await userDetails.checkUserData(userData);

    await logoutAndLogin(page, userData.email, userData.password);
    await loginPage.expectError('Your account has been deactivated. Please contact your administrator.');
  });

  test('Create Activated Not Admin User', async ({page, userCreator, userTable, userDetails, unauthorizedView}) => {
    const userData = generateRandomUserData(false, true);
    await userTable.userHeader.addUserButton.click();
    await userCreator.fillAndSubmitUserForm(userData);

    const userRow = await userTable.getRowByEmail(userData.email);
    await userRow.checkUserData(userData);

    await userRow.userNameText.click();
    await userDetails.checkUserData(userData);

    await logoutAndLogin(page, userData.email, userData.password);
    await userDetails.isVisible();

    await navigationService.navigateTo(page, NavigationPaths.USER_TABLE);
    await unauthorizedView.isVisible();

    await navigationService.navigateTo(page, NavigationPaths.USER_CREATE);
    await unauthorizedView.isVisible();

    const apiUserData = generateRandomApiUserData();
    const createdUser = await usersApi.createUser(apiUserData);
    await navigationService.navigateTo(page, NavigationPaths.USER_EDIT, createdUser.id);
    await unauthorizedView.isVisible();
  });

  test('Create Deactivated Not Admin User', async ({page, userCreator, userTable, userDetails, loginPage}) => {
    const userData = generateRandomUserData(false, false);
    await userTable.userHeader.addUserButton.click();
    await userCreator.fillAndSubmitUserForm(userData);

    const userRow = await userTable.getRowByEmail(userData.email);
    await userRow.checkUserData(userData);

    await userRow.userNameText.click();
    await userDetails.checkUserData(userData);

    await logoutAndLogin(page, userData.email, userData.password);
    await loginPage.expectError('Your account has been deactivated. Please contact your administrator.');
  });

  test('Create User with Only Required Fields (Name, Surname, Email, Password)', async ({
    page,
    userCreator,
    userTable,
    userDetails,
    loginPage,
  }) => {
    const userData: UserData = {
      name: randomUtil.randomName(),
      surname: randomUtil.randomName(),
      email: randomUtil.randomEmail(),
      password: randomUtil.randomName(),
    };

    await userTable.userHeader.addUserButton.click();
    await userCreator.fillAndSubmitUserForm(userData);

    const userRow = await userTable.getRowByEmail(userData.email);
    await userRow.checkUserData(userData);

    await userRow.userNameText.click();
    await userDetails.checkUserData(userData);

    await logoutAndLogin(page, userData.email, userData.password);
    await loginPage.expectError('Your account has been deactivated. Please contact your administrator.');
  });

  test('Validate User Form Inputs', async ({userCreator, userTable}) => {
    const apiUserData = generateRandomApiUserData();
    const createdUser = await usersApi.createUser(apiUserData);

    /** Required inputs **/
    await userTable.userHeader.addUserButton.click();
    await userCreator.submitForm();
    await userCreator.expectError('User Name is required');
    await userCreator.expectError('Surname is required');
    await userCreator.expectError('Email is required');
    await userCreator.expectError('Password is required');

    await userCreator.nameInput.fill(randomUtil.randomName());
    await userCreator.surnameInput.fill(randomUtil.randomName());
    await userCreator.emailInput.fill(randomUtil.randomEmail());

    /** Password must be at least 9 characters long && passwords must match **/
    await userCreator.passwordInput.fill(randomUtil.randomName(8));
    await userCreator.submitForm();
    await userCreator.expectError('Password must be at least 9 characters long');
    await userCreator.expectError('Passwords must match');

    const password = randomUtil.randomName();
    await userCreator.passwordInput.fill(password);
    await userCreator.confirmPasswordInput.fill(password);

    /** Your phone number does not exist **/
    await userCreator.phoneNumberInput.fill(randomUtil.randomName());
    await userCreator.submitForm();
    await userCreator.expectError('Your phone number does not exist');
    await userCreator.phoneNumberInput.fill(randomUtil.randomPhoneNumber());

    /** Salary must be a number **/
    await userCreator.salaryInput.fill(randomUtil.randomName());
    await userCreator.submitForm();
    await userCreator.expectError('Salary must be a number');

    /** Salary has to be without minus sign **/
    await userCreator.salaryInput.fill(`-${randomUtil.randomStringNumber(4)}`);
    await userCreator.submitForm();
    await userCreator.expectError('Salary must be a number');
    await userCreator.salaryInput.fill(randomUtil.randomStringNumber(4));

    /** End date must be after start date **/
    const startTime = randomUtil.randomDate();
    const endTime = randomUtil.randomYoungerDate(startTime);

    await userCreator.endTimeInput.fill(startTime);
    await userCreator.startTimeInput.fill(endTime);
    await userCreator.submitForm();
    await userCreator.expectError('End date must be after start date');
    await userCreator.startTimeInput.fill(startTime);
    await userCreator.endTimeInput.fill(endTime);

    /** Email already exists **/
    await userCreator.emailInput.fill(createdUser.email);
    await userCreator.submitForm();
    await userCreator.expectError('Email already exists');
    const createdUserEmail = randomUtil.randomEmail();
    await userCreator.emailInput.fill(createdUserEmail);

    /** User should be created correctly **/
    await userCreator.submitForm();
    const userRow = await userTable.getRowByEmail(createdUserEmail);
    await userRow.isVisible();
  });
});
