import { IsNotEmpty, IsInt, IsDateString, IsUUID } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @IsNotEmpty()
  @IsDateString()
  desiredAt: string;

  @IsNotEmpty()
  @IsUUID()
  receiveLocationId: string;
}
