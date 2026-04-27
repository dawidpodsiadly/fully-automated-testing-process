import {test as base} from '@playwright/test';
import {LoginPage} from '../models/login-page/login-page.model';
import {UnauthorizedView} from '../models/unauthorized/unauthorized.model';
import {UserCreator} from '../models/user-creator/user-creator.model';
import {UserDetails} from '../models/user-details/user-details.model';
import {UserTable} from '../models/user-table/user-table.model';
import {UserUpdate} from '../models/user-update/user-update.model';

type PageObjectFixtures = {
  loginPage: LoginPage;
  unauthorizedView: UnauthorizedView;
  userCreator: UserCreator;
  userDetails: UserDetails;
  userTable: UserTable;
  userUpdate: UserUpdate;
};

export const test = base.extend<PageObjectFixtures>({
  loginPage: async ({page}, use) => {
    await use(new LoginPage(page));
  },
  unauthorizedView: async ({page}, use) => {
    await use(new UnauthorizedView(page));
  },
  userCreator: async ({page}, use) => {
    await use(new UserCreator(page));
  },
  userDetails: async ({page}, use) => {
    await use(new UserDetails(page));
  },
  userTable: async ({page}, use) => {
    await use(new UserTable(page));
  },
  userUpdate: async ({page}, use) => {
    await use(new UserUpdate(page));
  },
});
