import type { TReservation as BaseTReservation } from "./../../../../server/app/src/reservation/entities/reservation.entity";
import type { CreateReservationDto } from "./../../../../server/app/src/reservation/dto/create-reservation.dto";
import type { UpdateReservationForPackedDto } from "./../../../../server/app/src/reservation/dto/update-reservation-for-packed.dto";
import type { Jsonify } from "type-fest";
import { baseAPI } from "../api/base";

export type TReservation = Jsonify<BaseTReservation>;
export type TReservationForm = Jsonify<CreateReservationDto>;
export type TReservationPackedForm = Jsonify<UpdateReservationForPackedDto>;

export const statusToText: Record<TReservation["status"], string> = {
  canceled: "キャンセル",
  packking: "出荷準備中",
  shipping: "配送中",
  keeping: "店舗保管中",
  completed: "受取完了",
};

export const RESERVATION_STATUS = {
  canceled: "canceled", // キャンセル
  packking: "packking", // 出荷準備中
  shipping: "shipping", // 配送中
  keeping: "keeping", // 店舗保管中
  completed: "completed", // 受取完了
} as const;

export class ReservationRepository {
  get baseEndpoint(): string {
    return "reservations";
  }

  async allReservations(): Promise<TReservation[]> {
    return await baseAPI<TReservation[]>({
      endpoint: `${this.baseEndpoint}/products`,
    });
  }

  async findOne(id: string): Promise<TReservation> {
    return await baseAPI<TReservation>({
      endpoint: `${this.baseEndpoint}/products/${id}`,
    });
  }

  async create(body: TReservationForm): Promise<TReservation> {
    return await baseAPI<TReservation>({
      endpoint: `${this.baseEndpoint}`,
      method: "POST",
      body,
    });
  }

  async packed(
    id: string,
    body: TReservationPackedForm
  ): Promise<TReservation> {
    return await baseAPI<TReservation>({
      endpoint: `${this.baseEndpoint}/products/${id}/packed`,
      method: "PUT",
      body,
    });
  }

  async kept(id: string): Promise<TReservation> {
    return await baseAPI<TReservation>({
      endpoint: `${this.baseEndpoint}/products/${id}/kept`,
      method: "PUT",
    });
  }

  async received(id: string): Promise<TReservation> {
    return await baseAPI<TReservation>({
      endpoint: `${this.baseEndpoint}/products/${id}/received`,
      method: "PUT",
    });
  }
}
