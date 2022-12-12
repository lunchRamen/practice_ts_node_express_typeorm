import { IsAlphanumeric, IsString } from 'class-validator';

export class CreateUserDto {
  @IsAlphanumeric()
  public nickname: string;

  @IsString()
  public password: string;
}
