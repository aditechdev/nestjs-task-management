/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  // ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialDto: AuthCredentialDto): Promise<void> {
    try {
      console.log('STEP 1');

      const { username, password } = authCredentialDto;

      console.log('STEP 2');
      const salt = await bcrypt.genSalt();

      console.log('STEP 3');
      console.log('BEFORE HASH');

      const hashedPassword = await bcrypt.hash(password, salt);
      console.log('AFTER HASH');

      console.log('STEP 4');

      const user = this.create({
        username,
        password: hashedPassword,
      });

      console.log('STEP 5');

      await this.save(user);

      console.log('STEP 6');
    } catch (error: unknown) {
      console.error('UsersRepository.createUser', error);

      throw new InternalServerErrorException();
    }
  }
}
