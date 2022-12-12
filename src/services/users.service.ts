import { hash } from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '@dtos/users.dto';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';

@EntityRepository()
class UserService extends Repository<UserEntity> {
  public async findAllUser(): Promise<User[]> {
    const users: User[] = await UserEntity.find();
    return users;
  }

  public async findUserById(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');

    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await UserEntity.findOne({ where: { nickname: userData.nickname } });
    if (findUser) throw new HttpException(409, `This nickname ${userData.nickname} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await UserEntity.create({ ...userData, password: hashedPassword }).save();

    return createUserData;
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const sameNicknameUser: User = await UserEntity.findOne({ where: { nickname: userData.nickname } });
    if (sameNicknameUser) throw new HttpException(409, `This nickname ${userData.nickname} already exists`);

    let updateNickname = '';
    let updatePassword = '';

    if (userData.nickname != '' && userData.password != '') {
      updateNickname = userData.nickname;
      updatePassword = await hash(userData.password, 10);
    }

    if (userData.nickname != '' && userData.password == '') {
      updateNickname = userData.nickname;
      updatePassword = findUser.password;
    }

    if (userData.nickname == '' && userData.password != '') {
      updateNickname = findUser.nickname;
      updatePassword = await hash(userData.password, 10);
    }
    await UserEntity.update(userId, { nickname: updateNickname, password: updatePassword });

    const updateUser: User = await UserEntity.findOne({ where: { id: userId } });
    return updateUser;
  }

  public async deleteUser(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');

    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await UserEntity.delete({ id: userId });
    return findUser;
  }
}

export default UserService;
