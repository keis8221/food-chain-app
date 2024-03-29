import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GetAccount } from 'src/account/get-account.decorator';
import { JwtAuthGuard } from 'src/account/jwt-auth.guard';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationForPackedDto } from './dto/update-reservation-for-packed.dto';
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
  async getReservation(
    @Param('reservationId') reservationId: string,
  ): Promise<TReservation> {
    return await this.reservationService.getReservation(reservationId);
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

  @Put('/products/:reservationId/packed')
  async updateReservationForPacked(
    @GetAccount() account: Account,
    @Param('reservationId') reservationId: string,
    @Body() updateReservationForPackedDto: UpdateReservationForPackedDto,
  ): Promise<TReservation> {
    return this.reservationService.updateReservationForPacked(
      account,
      reservationId,
      updateReservationForPackedDto,
    );
  }

  @Put('/products/:reservationId/kept')
  async updateReservationForKept(
    @GetAccount() account: Account,
    @Param('reservationId') reservationId: string,
  ): Promise<TReservation> {
    return this.reservationService.updateReservationForKept(
      account,
      reservationId,
    );
  }

  @Put('/products/:reservationId/received')
  async updateReservationForReceived(
    @GetAccount() account: Account,
    @Param('reservationId') reservationId: string,
  ): Promise<TReservation> {
    return this.reservationService.updateReservationForReceived(
      account,
      reservationId,
    );
  }
}
