import { BaseEntityAddHashId } from 'src/common/base-entity-add-hash-id';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LiffConfig } from './liff-config.entity';
import { LineConfig } from './line-config.entity';

@Entity()
export class LineProvider extends BaseEntityAddHashId {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  description: string;

  @CreateDateColumn()
  readonly createdAt?: Date;

  @UpdateDateColumn()
  readonly updatedAt?: Date;

  @DeleteDateColumn()
  readonly deletedAt?: Date;

  @OneToOne(() => LineConfig, (lineConfig) => lineConfig.lineProvider)
  lineConfig: LineConfig;

  @OneToOne(() => LiffConfig, (liffConfig) => liffConfig.lineProvider)
  liffConfig: LiffConfig;
}
