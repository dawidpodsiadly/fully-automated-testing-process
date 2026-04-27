import {test} from '../../fixtures/page-object.fixture';
import {generateRandomApiUserData} from '../../api/users/users.factory';
import {usersApi} from '../../api/users/users.api';
import {NavigationPaths, navigationService} from '../../services/navigation.service';
import {defaultConfig} from '../../../config';
import {randomUtil} from '../../utils/random.utils';

test.describe('Login Page', () => {
  test.beforeEach(async ({page}) => {
    await navigationService.navigateTo(page, NavigationPaths.LOGIN);
  });

  test('Login with Correct Credentials', async ({loginPage}) => {
    await loginPage.login(defaultConfig.userEmail, defaultConfig.userPassword);
    await loginPage.expectToBeLoggedIn();
  });

  test('Login with Incorrect Credentials', async ({loginPage}) => {
    await loginPage.login(defaultConfig.userEmail, randomUtil.randomName());
    await loginPage.expectError('Invalid email or password.');
    await loginPage.expectToBeLoggedIn(false);
  });

  test('Going to any URL Without Logging in Should Redirect to the Login Page', async ({page, loginPage}) => {
    const apiUserData = generateRandomApiUserData();
    const createdUser = await usersApi.createUser(apiUserData);

    await navigationService.navigateTo(page, NavigationPaths.USER_TABLE);
    await loginPage.expectToBeLoggedIn(false);

    await navigationService.navigateTo(page, NavigationPaths.USER_CREATE);
    await loginPage.expectToBeLoggedIn(false);

    await navigationService.navigateTo(page, NavigationPaths.USER_EDIT, createdUser.id);
    await loginPage.expectToBeLoggedIn(false);

    await navigationService.navigateTo(page, NavigationPaths.USER_DETAILS, createdUser.id);
    await loginPage.expectToBeLoggedIn(false);
  });
});
