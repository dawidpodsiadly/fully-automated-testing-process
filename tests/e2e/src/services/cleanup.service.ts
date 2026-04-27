import {usersApi} from '../api/users/users.api';

class CleanupService {
  async performFullCleanup() {
    await this.cleanupUsers();
  }

  async cleanupUsers() {
    try {
      const usersGetResponse = await usersApi.getUsers();
      const usersToDelete = usersGetResponse.filter((user: any) => user.email.startsWith('e2e_'));

      if (usersToDelete.length > 0) {
        for (const user of usersToDelete) {
          await usersApi.deleteUser(user._id);
        }
      }
    } catch (error) {
      console.error('Error during Users Cleanup: ', error);
    }
  }
}
export const cleanupService = new CleanupService();
