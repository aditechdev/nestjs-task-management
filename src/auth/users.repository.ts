/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
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
      const { username, password } = authCredentialDto;

      const salt = await bcrypt.genSalt();

      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.create({
        username,
        password: hashedPassword,
      });

      await this.save(user);
    } catch (error: unknown) {
      console.error('UsersRepository.createUser', error);

      if (typeof error === 'object' && error !== null && 'code' in error) {
        const dbError = error as {
          code: string;
        };

        if (dbError.code === '23505') {
          throw new ConflictException('Username already exists');
        }
      }

      throw new InternalServerErrorException();
    }
  }
}
