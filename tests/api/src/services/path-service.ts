const baseUrl = 'http://34.118.119.76/api';

export class PathService {
  static readonly paths = {
    auth: baseUrl + '/auth',
    users: baseUrl + '/users',
  };
}
