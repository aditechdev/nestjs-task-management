import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  signUp(@Body() body: AuthCredentialDto): Promise<void> {
    return this.authService.signUp(body);
  }

  @Post('/signIn')
  signIn(@Body() body: AuthCredentialDto): Promise<string> {
    return this.authService.signIn(body);
  }
}
