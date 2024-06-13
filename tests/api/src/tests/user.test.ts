import request from 'supertest';
import { PathService } from '../services/path-service';
import { authService } from '../services/auth-service';
import { userBody } from '../utils/bodies.util';
import { TestUsers } from '../services/auth-service';
import { testPassword } from '../services/auth-service';
import { randomUtil } from '../utils/random.util';

const baseUrl = PathService.paths.user;
let adminToken: { Authorization: string };
let notAdminToken: { Authorization: string };

describe('User Endpoints', () => {
    beforeAll(async () => {
        adminToken = await authService.authorizeToken();
        notAdminToken = await authService.authorizeToken(TestUsers.apiTesterNotAdmin, testPassword);
    });

    describe('GET /user', () => {
        it('Should return 401 when no Token - GET /user', async () => {
            const response = await request(baseUrl).get('/')
            expect(response.status).toBe(401);
            expect(response.text).toEqual('Unauthorized');
        });

        it('Should return 403 when as Not Admin User - GET /user', async () => {
            const response = await request(baseUrl).get('/').set(notAdminToken);
            expect(response.status).toBe(403);
            expect(response.body.message).toEqual('Unauthorized: Only administrators can perform this action');
        });

        it('Should return 200 and Contain User IDs as Admin User - GET /user', async () => {
            const firstUserBody = userBody();
            const secondUserBody = userBody();
    
            const firstUserResponse = await request(baseUrl).post('/').send(firstUserBody).set(adminToken);
            const secondUserResponse = await request(baseUrl).post('/').send(secondUserBody).set(adminToken);
    
            const firstUserId = firstUserResponse.body.id;
            const secondUserId = secondUserResponse.body.id;
    
            const response = await request(baseUrl).get('/').set(adminToken);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.map((user: { _id: string; }) => user._id)).toEqual(expect.arrayContaining([firstUserId, secondUserId]));
        });
    });

    describe('GET /user/id', () => {
        it('Should return 401 when no Token - POST /user/id', async () => {
            const createUserResponse = await request(baseUrl).post('/').send(userBody()).set(adminToken);
            const userId = createUserResponse.body.id;

            const response = await request(baseUrl).get(`/${userId}`);
            expect(response.status).toBe(401);
            expect(response.text).toEqual('Unauthorized');
        });

        it('Should return 404 when Id Not Found - POST /user/id', async () => {
            const wrongUserId = '666b5bfd8e3c464090cb69b8'
            const response = await request(baseUrl).get(`/${wrongUserId}`).set(adminToken);
            expect(response.status).toBe(404);
            expect(response.text).toContain(`User with id = ${wrongUserId} not found`);
        });

        it('Should return 400 when Invalid User Id Format - POST /user/id', async () => {
            const response = await request(baseUrl).get(`/${randomUtil.randomNameWithPrefix}`).set(adminToken);
            expect(response.status).toBe(400);
            expect(response.body.message).toEqual('Invalid user ID format');
        });

        it('Should return 200 and Contain User Data as Not Admin User - POST /user/id', async () => {
            const userBodyData = userBody();
            const createUserResponse = await request(baseUrl).post('/').send(userBodyData).set(adminToken);
            const userId = createUserResponse.body.id;

            const getUserResponse = await request(baseUrl).get(`/${userId}`).set(notAdminToken);
            expect(getUserResponse.status).toBe(200);

            expect(getUserResponse.body.name).toEqual(userBodyData.name);
            expect(getUserResponse.body.surname).toEqual(userBodyData.surname);
            expect(getUserResponse.body.email).toEqual(userBodyData.email);
            expect(getUserResponse.body.phoneNumber).toEqual(userBodyData.phoneNumber);
            expect(getUserResponse.body.birthDate).toEqual(userBodyData.birthDate);

            expect(getUserResponse.body.contract.type).toEqual(userBodyData.contract.type);
            expect(getUserResponse.body.contract.salary).toEqual(userBodyData.contract.salary);
            expect(getUserResponse.body.contract.position).toEqual(userBodyData.contract.position);
            expect(getUserResponse.body.contract.startTime).toEqual(userBodyData.contract.startTime);
            expect(getUserResponse.body.contract.endTime).toEqual(userBodyData.contract.endTime);
            
            expect(getUserResponse.body.notes).toEqual(userBodyData.notes);
            expect(getUserResponse.body.isAdmin).toEqual(userBodyData.isAdmin);
            expect(getUserResponse.body.isActivated).toEqual(userBodyData.isActivated);
            expect(getUserResponse.body._id).toEqual(userId);
            expect(getUserResponse.body).toHaveProperty('lastUpdated');
        });

        it('Should return 200 and Contain User Data as Admin User - POST /user/id', async () => {
            const userBodyData = userBody();
            const createUserResponse = await request(baseUrl).post('/').send(userBodyData).set(adminToken);
            const userId = createUserResponse.body.id;

            const response = await request(baseUrl).get(`/${userId}`).set(adminToken);
            expect(response.status).toBe(200);

            expect(response.body.name).toEqual(userBodyData.name);
            expect(response.body.surname).toEqual(userBodyData.surname);
            expect(response.body.email).toEqual(userBodyData.email);
            expect(response.body.phoneNumber).toEqual(userBodyData.phoneNumber);
            expect(response.body.birthDate).toEqual(userBodyData.birthDate);

            expect(response.body.contract.type).toEqual(userBodyData.contract.type);
            expect(response.body.contract.salary).toEqual(userBodyData.contract.salary);
            expect(response.body.contract.position).toEqual(userBodyData.contract.position);
            expect(response.body.contract.startTime).toEqual(userBodyData.contract.startTime);
            expect(response.body.contract.endTime).toEqual(userBodyData.contract.endTime);
            
            expect(response.body.notes).toEqual(userBodyData.notes);
            expect(response.body.isAdmin).toEqual(userBodyData.isAdmin);
            expect(response.body.isActivated).toEqual(userBodyData.isActivated);
            expect(response.body._id).toEqual(userId);
            expect(response.body).toHaveProperty('lastUpdated');
        });
    });
    
    describe('POST /user', () => {
        it('Should return 401 when no Token - POST /user', async () => {
            const response = await request(baseUrl).post('/').send(userBody());
            expect(response.status).toBe(401);
            expect(response.text).toEqual('Unauthorized');
        })

        it('Should return 403 as Not Admin User - POST /user', async () => {
            const response = await request(baseUrl).post('/').send(userBody()).set(notAdminToken);
            expect(response.status).toBe(403);
            expect(response.body.message).toEqual('Unauthorized: Only administrators can perform this action');
        })

        it('Should return 400 when Email already Exists - POST /user', async () => {
            const existingEmail = randomUtil.randomEmail();
            await request(baseUrl).post('/').send(userBody({ email: existingEmail })).set(adminToken);

            const response = await request(baseUrl).post('/').send(userBody({ email: existingEmail })).set(adminToken);
            expect(response.status).toBe(400);
            expect(response.body.message).toEqual('User with this email already exists');
        })

        it('Should return 400 when Contract End Time is earlier than Start Time - POST /user', async () => {
            const contractStartTime = '1939-09-10';
            const contractEndTime = '1410-07-15';

            const response = await request(baseUrl).post('/')
            .send({
                ...userBody(),
                contract: {
                    ...userBody().contract,
                    startTime: contractStartTime,
                    endTime: contractEndTime
                }
            })
            .set(adminToken);

            expect(response.status).toBe(400);
            expect(response.body.message).toEqual('End time cannot be earlier than start time');
        })

        it('Should return 200 and Create new User as Admin User - POST /user', async () => {
            const userBodyData = userBody();
        
            const response = await request(baseUrl).post('/').send(userBodyData).set(adminToken);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id');
            expect(response.body.message).toEqual(`User has been created with id = ${response.body.id}`);
        });

        it('Should return 400 when Required Filed is Missing (Name, Surname, Email, Password) - POST /user', async () => {
            let userBody = {
                name: '',
                surname: '',
                email: '',
                password: randomUtil.randomName(9),
            }

            let response = await request(baseUrl).post('/').send(userBody).set(adminToken);
            expect(response.status).toBe(400);
            expect(response.body.message).toEqual('User validation failed: name: Path `name` is required., surname: Path `surname` is required., email: Path `email` is required.');

            userBody.name = randomUtil.randomNameWithPrefix();

            response = await request(baseUrl).post('/').send(userBody).set(adminToken);
            expect(response.status).toBe(400);
            expect(response.body.message).toEqual('User validation failed: surname: Path `surname` is required., email: Path `email` is required.');

            userBody.surname = randomUtil.randomNameWithPrefix();

            response = await request(baseUrl).post('/').send(userBody).set(adminToken);
            expect(response.status).toBe(400);
            expect(response.body.message).toEqual('User validation failed: email: Path `email` is required.');
            
            userBody.email = randomUtil.randomEmail();
            userBody.password = ''

            response = await request(baseUrl).post('/').send(userBody).set(adminToken);
            expect(response.status).toBe(400);
            expect(response.body.message).toEqual('Password must be at least 9 characters long');

            userBody.password = randomUtil.randomName(9);

            response = await request(baseUrl).post('/').send(userBody).set(adminToken);
            expect(response.status).toBe(200);
        })

        it('Should return 200 and isAdmin and isActivated Should be `false` when Not Passed - POST /user', async () => {
            let userBody = {
                name:  randomUtil.randomNameWithPrefix(),
                surname:  randomUtil.randomNameWithPrefix(),
                email:  randomUtil.randomEmail(),
                password:  randomUtil.randomName(),
            }

            const createUserResponse = await request(baseUrl).post('/').send(userBody).set(adminToken);
            const userId = createUserResponse.body.id
            expect(createUserResponse.status).toBe(200);
            expect(createUserResponse.body).toHaveProperty('id');
            expect(createUserResponse.body.message).toEqual(`User has been created with id = ${userId}`);

            
            const getUserResponse = await request(baseUrl).get(`/${userId}`).send(userBody).set(adminToken);
            expect(getUserResponse.status).toBe(200);
            expect(getUserResponse.body.name).toEqual(userBody.name);
            expect(getUserResponse.body.surname).toEqual(userBody.surname);
            expect(getUserResponse.body.email).toEqual(userBody.email);
            expect(getUserResponse.body.isAdmin).toEqual(false);
            expect(getUserResponse.body.isActivated).toEqual(false);
            expect(getUserResponse.body).toHaveProperty('lastUpdated');
        })

        it('Should return 400 when Phone Number `< 9` or `> 14` - POST /user', async () => {
            const phoneNumberTooShort = '12345678';
            const phoneNumberTooLong = '123456789012345';

            let response = await request(baseUrl).post('/')
            .send({
                ...userBody(),
                phoneNumber: phoneNumberTooShort,
            })
            .set(adminToken);

            expect(response.status).toBe(400);
            expect(response.body.message).toEqual('Phone number cannot be shorter than 9 digits or longer than 14');

            response = await request(baseUrl).post('/')
            .send({
                ...userBody(),
                phoneNumber: phoneNumberTooLong,
            })
            .set(adminToken);

            expect(response.status).toBe(400);
            expect(response.body.message).toEqual('Phone number cannot be shorter than 9 digits or longer than 14');
        })

        it('Should return 400 when Password is `< 9` Chars - POST /user', async () => {
            const passwordTooShort = randomUtil.randomName(8);

            let response = await request(baseUrl).post('/')
            .send({
                ...userBody(),
                password: passwordTooShort,
            })
            .set(adminToken);

            expect(response.status).toBe(400);
            expect(response.body.message).toEqual('Password must be at least 9 characters long');
        })

        it('Should return 400 when Trying to Send lastUpdated Field - POST /user', async () => {
            let userBody = {
                name:  randomUtil.randomNameWithPrefix(),
                surname:  randomUtil.randomNameWithPrefix(),
                email:  randomUtil.randomEmail(),
                password:  randomUtil.randomName(),
                lastUpdated: '1920-08-12'
            }

            const response = await request(baseUrl).post('/').send(userBody).set(adminToken);
            expect(response.status).toBe(200);
        })

        it('Should return 400 when Trying to add Position Filed other than Storekeeper, Accountant, IT - POST /user', async () => {
            const notExistingContractPosition = randomUtil.randomName();

            const response = await request(baseUrl).post('/')
            .send({
                    ...userBody(),
                    contract: {
                        ...userBody().contract,
                        position: notExistingContractPosition,
                    }
                })
                .set(adminToken);

            expect(response.status).toBe(400);
            expect(response.body.message).toEqual(`User validation failed: contract.position: \`${notExistingContractPosition}\` is not a valid enum value for path \`contract.position\`.`);
        })

        it('Should return 400 when Trying to add Contract Type Filed other than Employment, Mandate, IT - POST /user', async () => {
            const notExistingContractType = randomUtil.randomName();

            const response = await request(baseUrl).post('/')
            .send({
                    ...userBody(),
                    contract: {
                        ...userBody().contract,
                        type: notExistingContractType,
                    }
                })
                .set(adminToken);
            expect(response.status).toBe(400);
            expect(response.body.message).toEqual(`User validation failed: contract.type: \`${notExistingContractType}\` is not a valid enum value for path \`contract.type\`.`);
        })

        it('Should return 400 when Trying to Add something Other than Date to the Fields - POST /user', async () => {
            const notDateBirthDate = randomUtil.randomName();
            const notDateContractStartTime = randomUtil.randomName();
            const notDateContractEndTime = randomUtil.randomName();

            let response = await request(baseUrl).post('/')
            .send({...userBody(), 
                birthDate: notDateBirthDate})
                .set(adminToken);

            expect(response.status).toBe(400);
            expect(response.body.message).toEqual('Invalid date format');

            response = await request(baseUrl).post('/')
            .send({
                    ...userBody(),
                    contract: {
                        ...userBody().contract,
                        startTime: notDateContractStartTime,
                    }
                })
                .set(adminToken);

            expect(response.status).toBe(400);
            expect(response.body.message).toEqual('Invalid date format')

            response = await request(baseUrl).post('/')
            .send({
                    ...userBody(),
                    contract: {
                        ...userBody().contract,
                        startTime: notDateContractEndTime,
                    }
                })
                .set(adminToken);

            expect(response.status).toBe(400);
            expect(response.body.message).toEqual('Invalid date format')
        })
    });
    describe('DELETE /User/id', () => {
        it('Should return 401 when no Token - DELETE /user/id', async () => {
            const createUserResponse = await request(baseUrl).post('/').send(userBody()).set(adminToken);
            const userId = createUserResponse.body.id;

            const deleteUserResponse = await request(baseUrl).delete(`/${userId}`).send(userBody());
            expect(deleteUserResponse.status).toBe(401);
            expect(deleteUserResponse.text).toEqual('Unauthorized');
        })

        it('Should return 403 as Not Admin User - DELETE /user/id', async () => {
            const createUserResponse = await request(baseUrl).post('/').send(userBody()).set(adminToken);
            const userId = createUserResponse.body.id;

            const deleteUserResponse = await request(baseUrl).delete(`/${userId}`).send(userBody()).set(notAdminToken);
            expect(deleteUserResponse.status).toBe(403);
            expect(deleteUserResponse.body.message).toEqual('Unauthorized: Only administrators can perform this action');
        })

        it('Should return 200 and Delete User as Admin User - DELETE /user/id', async () => {
            const createUserResponse = await request(baseUrl).post('/').send(userBody()).set(adminToken);
            const userId = createUserResponse.body.id;

            const deleteUserResponse = await request(baseUrl).delete(`/${userId}`).send(userBody()).set(adminToken);
            expect(deleteUserResponse.status).toBe(200);
            expect(deleteUserResponse.body.message).toEqual(`User with id = ${userId} has been deleted`);

            const getUserResponse = await request(baseUrl).get(`/${userId}`).set(adminToken);
            expect(getUserResponse.status).toBe(404);
            expect(getUserResponse.text).toContain(`User with id = ${userId} not found`);
        })

        it('Should return 404 when Id Not Found - DELETE /user/id', async () => {
            const wrongUserId = '666b5bfd8e3c464090cb69b8'
            const response = await request(baseUrl).delete(`/${wrongUserId}`).set(adminToken);
            expect(response.status).toBe(404);
            expect(response.text).toContain(`User with id = ${wrongUserId} not found`);
        });

        it('Should return 400 when Invalid User Id Format - DELETE /user/id', async () => {
            const response = await request(baseUrl).delete(`/${randomUtil.randomNameWithPrefix}`).set(adminToken);
            expect(response.status).toBe(400);
            expect(response.body.message).toEqual('Invalid user ID format');
        });
    })
});
