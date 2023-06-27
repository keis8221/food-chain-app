import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateReservationForPackedDto {
  @IsNotEmpty()
  @IsUUID()
  shipperId: string;
}
