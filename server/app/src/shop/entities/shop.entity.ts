import { LineProvider } from 'src/line/entities/line-provider.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Shop extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { comment: '店舗ID' })
  readonly id!: string;

  @Column({ comment: '店舗名', type: 'varchar', length: 30 })
  name!: string;

  @Column({ comment: 'メールアドレス', type: 'varchar', length: 50 })
  email!: string;

  @Column({ comment: '電話番号', type: 'varchar', length: 14 })
  tel!: string;

  @Column({ comment: '郵便番号', type: 'varchar', name: 'zip_code', length: 8 })
  zipCode!: string;

  @Column({ comment: '住所', type: 'varchar', length: 100 })
  address!: string;

  @Column({ comment: '説明', type: 'text', default: '' })
  description?: string;

  @CreateDateColumn({
    comment: '開店時間',
    type: 'timestamptz',
    name: 'opened_at',
  })
  openedAt!: Date;

  @CreateDateColumn({
    comment: '閉店時間',
    type: 'timestamptz',
    name: 'closed_at',
  })
  closedAt!: Date;

  @CreateDateColumn({
    comment: '作成日時',
    type: 'timestamptz',
    name: 'created_at',
  })
  readonly createdAt?: Date;

  @UpdateDateColumn({
    comment: '更新日時',
    type: 'timestamptz',
    name: 'updated_at',
  })
  readonly updatedAt?: Date;

  @DeleteDateColumn({
    comment: '削除日時',
    type: 'timestamptz',
    name: 'deleted_at',
  })
  readonly deletedAt?: Date;

  @OneToOne(() => LineProvider, (lineProvider) => lineProvider.shop)
  lineProvider: LineProvider;

  @OneToMany(() => Reservation, (reservation) => reservation.shop)
  reservations: Reservation[];

  convertTShop() {
    return {
      ...this,
      reservations: this.reservations.map(
        (reservation) => reservation.convertTReservation() || [],
      ),
    };
  }
}

export type TShop = Pick<
  Shop,
  | 'name'
  | 'email'
  | 'tel'
  | 'zipCode'
  | 'address'
  | 'description'
  | 'openedAt'
  | 'closedAt'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
> & {
  id: string;
  lineProvider?: LineProvider;
  reservations: Reservation[];
};
