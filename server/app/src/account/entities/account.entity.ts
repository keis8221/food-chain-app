import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';

export const USER_CLASSIFICATION = {
  individual: 'individual',
  corporate: 'corporate',
} as const;

export const USER_ATTRIBUTE = {
  producer: 'producer',
  consumer: 'consumer',
  logistics: 'logistics',
} as const;

@Entity()
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { comment: 'ユーザーID' })
  readonly id!: string;

  @Column({ comment: 'メールアドレス', type: 'varchar', length: 50 })
  email!: string;

  @Column({ comment: 'パスワード', type: 'varchar', length: 72 })
  password!: string;

  @Column({ comment: '区分', type: 'varchar', length: 10 })
  classification!: typeof USER_CLASSIFICATION[keyof typeof USER_CLASSIFICATION];

  @Column({ comment: '属性', type: 'varchar', length: 10 })
  attribute!: typeof USER_ATTRIBUTE[keyof typeof USER_ATTRIBUTE];

  @Column({ comment: '名前', type: 'varchar', length: 30 })
  name!: string;

  @Column({ comment: '電話番号', type: 'varchar', length: 14 })
  tel!: string;

  @Column({ comment: '郵便番号', type: 'varchar', name: 'zip_code', length: 8 })
  zipCode!: string;

  @Column({ comment: '住所', type: 'varchar', length: 100 })
  address!: string;

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

  @OneToMany(() => Product, (product) => product.producer)
  products: Product[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];
}
