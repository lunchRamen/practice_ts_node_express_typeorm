import bcrypt from 'bcrypt';
import request from 'supertest';
import { createConnection, getConnection, Repository } from 'typeorm';
import App from '@/app';
import { dbConnection } from '@databases';
import { CreateUserDto } from '@dtos/users.dto';
import { UserEntity } from '@entities/users.entity';
import UserRoute from '@routes/users.route';

describe('Testing Users', () => {
  beforeAll(async () => {
    return createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [UserEntity],
      synchronize: true,
      logging: false,
    });
  });

  afterAll(async () => {
    const conn = getConnection();
    return conn.close();
  });

  describe('[POST] /users', () => {
    it('response Create user', async () => {
      const userData: CreateUserDto = {
        nickname: 'bloom6561',
        password: 'q1w2e3r4!',
      };

      const usersRoute = new UserRoute();
      const userRepository = new Repository<UserEntity>();

      userRepository.findOne = jest.fn().mockReturnValue(null);
      userRepository.save = jest.fn().mockReturnValue({
        id: 1,
        nickname: userData.nickname,
        password: await bcrypt.hash(userData.password, 10),
      });

      const app = new App([usersRoute]);
      return request(app.getServer()).post(`${usersRoute.path}`).send(userData).expect(201);
    });
  });

  describe('[GET] /users', () => {
    it('response findAll users', async () => {
      const usersRoute = new UserRoute();
      const userRepository = new Repository<UserEntity>();

      userRepository.find = jest.fn().mockReturnValue([
        {
          id: 1,
          nickname: 'bloom6561',
          password: await bcrypt.hash('q1w2e3r4!', 10),
        },
        {
          id: 2,
          nickname: 'bloom6562',
          password: await bcrypt.hash('a1s2d3f4!', 10),
        },
        {
          id: 3,
          nickname: 'bloom6563',
          password: await bcrypt.hash('z1x2c3v4!', 10),
        },
      ]);

      const app = new App([usersRoute]);
      return request(app.getServer()).get(`${usersRoute.path}`).expect(200);
    });
  });

  describe('[GET] /users/:id', () => {
    it('response findOne user', async () => {
      const userId = 1;

      const usersRoute = new UserRoute();
      const userRepository = new Repository<UserEntity>();

      userRepository.findOne = jest.fn().mockReturnValue({
        id: userId,
        nickname: 'bloom6561',
        password: await bcrypt.hash('q1w2e3r4!', 10),
      });

      const app = new App([usersRoute]);
      return request(app.getServer()).get(`${usersRoute.path}/${userId}`).expect(200);
    });
  });

  describe('[PATCH] /users/:id', () => {
    it('response Update user', async () => {
      const userId = 1;
      const userData: CreateUserDto = {
        nickname: 'bloom6561',
        password: '1q2w3e4r!',
      };

      const updateuserData: CreateUserDto = {
        nickname: 'bloom6562',
        password: '1q2w3e4r!',
      };

      const usersRoute = new UserRoute();
      const userRepository = new Repository<UserEntity>();

      userRepository.findOne = jest.fn().mockReturnValue({
        id: userId,
        nickname: userData.nickname,
        password: await bcrypt.hash(userData.password, 10),
      });
      userRepository.update = jest.fn().mockReturnValue({
        id: userId,
        nickname: updateuserData.nickname,
        password: await bcrypt.hash(updateuserData.password, 10),
      });
      userRepository.findOne = jest.fn().mockReturnValue({
        id: userId,
        nickname: updateuserData.nickname,
        password: await bcrypt.hash(updateuserData.password, 10),
      });

      const app = new App([usersRoute]);
      return request(app.getServer()).patch(`${usersRoute.path}/${userId}`).send(updateuserData).expect(200);
    });
  });

  describe('[DELETE] /users/:id', () => {
    it('response Delete user', async () => {
      const userId = 1;

      const usersRoute = new UserRoute();
      const userRepository = new Repository<UserEntity>();

      userRepository.findOne = jest.fn().mockReturnValue({
        id: userId,
        nickname: 'bloom6561',
        password: await bcrypt.hash('q1w2e3r4!', 10),
      });

      const app = new App([usersRoute]);
      return request(app.getServer()).delete(`${usersRoute.path}/${userId}`).expect(200);
    });
  });
});
