import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  async signUp(@Body() body: AuthCredentialDto): Promise<void> {
    console.log('CONTROLLER HIT');
    return await this.authService.signUp(body);
  }

  @Post('/signIn')
  signIn(@Body() body: AuthCredentialDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(body);
  }
}
