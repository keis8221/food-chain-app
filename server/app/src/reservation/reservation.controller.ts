import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetAccount } from 'src/account/get-account.decorator';
import { JwtAuthGuard } from 'src/account/jwt-auth.guard';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { TReservation } from './entities/reservation.entity';
import { ReservationService } from './reservation.service';
import { Account } from 'src/account/entities/account.entity';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('/products')
  async getReservations(
    @GetAccount() account: Account,
  ): Promise<TReservation[]> {
    return this.reservationService.getReservations(account);
  }

  @Get('/products/:reservationId')
  async getReservation(@Param('id') id: string): Promise<TReservation> {
    return await this.reservationService.getReservation(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createReservation(
    @Body() createReservationDto: CreateReservationDto,
    @GetAccount() account: Account,
  ): Promise<TReservation> {
    return this.reservationService.createReservation(
      createReservationDto,
      account,
    );
  }
}
