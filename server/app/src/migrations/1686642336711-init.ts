import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1686642336711 implements MigrationInterface {
  name = 'migrations1686642336711';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(50) NOT NULL, "password" character varying(72) NOT NULL, "classification" character varying(10) NOT NULL, "attribute" character varying(10) NOT NULL, "name" character varying(30) NOT NULL, "tel" character varying(14) NOT NULL, "zip_code" character varying(8) NOT NULL, "address" character varying(100) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id")); COMMENT ON COLUMN "account"."id" IS 'ユーザーID'; COMMENT ON COLUMN "account"."email" IS 'メールアドレス'; COMMENT ON COLUMN "account"."password" IS 'パスワード'; COMMENT ON COLUMN "account"."classification" IS '区分'; COMMENT ON COLUMN "account"."attribute" IS '属性'; COMMENT ON COLUMN "account"."name" IS '名前'; COMMENT ON COLUMN "account"."tel" IS '電話番号'; COMMENT ON COLUMN "account"."zip_code" IS '郵便番号'; COMMENT ON COLUMN "account"."address" IS '住所'; COMMENT ON COLUMN "account"."created_at" IS '作成日時'; COMMENT ON COLUMN "account"."updated_at" IS '更新日時'; COMMENT ON COLUMN "account"."deleted_at" IS '削除日時'`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "producerId" uuid NOT NULL, "name" character varying(30) NOT NULL, "kinds" character varying(10) NOT NULL, "description" text NOT NULL DEFAULT '', "start_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "end_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "unit" character varying(10) NOT NULL, "unit_quantity" integer NOT NULL DEFAULT '1', "unit_price" integer NOT NULL DEFAULT '1', "image" text, "quantity" integer NOT NULL DEFAULT '1', "remaining" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id")); COMMENT ON COLUMN "product"."id" IS '出品ID'; COMMENT ON COLUMN "product"."producerId" IS '生産者ID'; COMMENT ON COLUMN "product"."name" IS '作物名'; COMMENT ON COLUMN "product"."kinds" IS '作物の種類'; COMMENT ON COLUMN "product"."description" IS '説明'; COMMENT ON COLUMN "product"."start_at" IS '予約開始'; COMMENT ON COLUMN "product"."end_at" IS '予約終了'; COMMENT ON COLUMN "product"."unit" IS '単位'; COMMENT ON COLUMN "product"."unit_quantity" IS '単価数量'; COMMENT ON COLUMN "product"."unit_price" IS '単価'; COMMENT ON COLUMN "product"."image" IS '画像'; COMMENT ON COLUMN "product"."quantity" IS '予約数量'; COMMENT ON COLUMN "product"."remaining" IS '残数量'; COMMENT ON COLUMN "product"."created_at" IS '作成日時'; COMMENT ON COLUMN "product"."updated_at" IS '更新日時'; COMMENT ON COLUMN "product"."deleted_at" IS '削除日時'`,
    );
    await queryRunner.query(
      `CREATE TABLE "reservation" ("hashId" character varying NOT NULL, "id" BIGSERIAL NOT NULL, "shippingDate" TIMESTAMP, "totalPrice" integer, "reservationDate" TIMESTAMP, "status" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "shopId" uuid, "userId" uuid, CONSTRAINT "UQ_9caeba8af385725b199a1e4c9e0" UNIQUE ("hashId"), CONSTRAINT "PK_48b1f9922368359ab88e8bfa525" PRIMARY KEY ("id")); COMMENT ON COLUMN "reservation"."shippingDate" IS '出荷日時'; COMMENT ON COLUMN "reservation"."reservationDate" IS '予約日時'; COMMENT ON COLUMN "reservation"."shopId" IS '店舗ID'; COMMENT ON COLUMN "reservation"."userId" IS 'ユーザーID'`,
    );
    await queryRunner.query(
      `CREATE TABLE "reservation_products" ("hashId" character varying NOT NULL, "id" BIGSERIAL NOT NULL, "reservationId" bigint NOT NULL, "productId" uuid NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "UQ_251ebb543c33df908609189ded6" UNIQUE ("hashId"), CONSTRAINT "PK_08c579b39d3b9955097ad25dcc1" PRIMARY KEY ("id", "reservationId", "productId")); COMMENT ON COLUMN "reservation_products"."quantity" IS '購入する商品数'`,
    );
    await queryRunner.query(
      `CREATE TABLE "shop" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(30) NOT NULL, "email" character varying(50) NOT NULL, "tel" character varying(14) NOT NULL, "zip_code" character varying(8) NOT NULL, "address" character varying(100) NOT NULL, "description" text NOT NULL DEFAULT '', "opened_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "closed_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_ad47b7c6121fe31cb4b05438e44" PRIMARY KEY ("id")); COMMENT ON COLUMN "shop"."id" IS '店舗ID'; COMMENT ON COLUMN "shop"."name" IS '店舗名'; COMMENT ON COLUMN "shop"."email" IS 'メールアドレス'; COMMENT ON COLUMN "shop"."tel" IS '電話番号'; COMMENT ON COLUMN "shop"."zip_code" IS '郵便番号'; COMMENT ON COLUMN "shop"."address" IS '住所'; COMMENT ON COLUMN "shop"."description" IS '説明'; COMMENT ON COLUMN "shop"."opened_at" IS '開店時間'; COMMENT ON COLUMN "shop"."closed_at" IS '閉店時間'; COMMENT ON COLUMN "shop"."created_at" IS '作成日時'; COMMENT ON COLUMN "shop"."updated_at" IS '更新日時'; COMMENT ON COLUMN "shop"."deleted_at" IS '削除日時'`,
    );
    await queryRunner.query(
      `CREATE TABLE "line_config" ("hashId" character varying NOT NULL, "id" BIGSERIAL NOT NULL, "name" character varying, "description" character varying, "status" character varying, "channelId" character varying, "channelSecret" character varying, "channelToken" character varying, "addFriendUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "lineProviderId" bigint, CONSTRAINT "UQ_eb72a3c95ae51b879ac3ea8c541" UNIQUE ("hashId"), CONSTRAINT "REL_cf9314bedecaf6ab45ebb3db1e" UNIQUE ("lineProviderId"), CONSTRAINT "PK_f9756496c0693550c70b14070d3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "line_provider" ("hashId" character varying NOT NULL, "id" BIGSERIAL NOT NULL, "name" character varying, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "shopId" uuid, CONSTRAINT "UQ_5bd175cab1a29fbc7cfdbf7d7ab" UNIQUE ("hashId"), CONSTRAINT "REL_2e9b8b873522fd798f15211397" UNIQUE ("shopId"), CONSTRAINT "PK_bce4bd9e49bab9cf0d1769b3511" PRIMARY KEY ("id")); COMMENT ON COLUMN "line_provider"."shopId" IS '店舗ID'`,
    );
    await queryRunner.query(
      `CREATE TABLE "liff_config" ("hashId" character varying NOT NULL, "id" BIGSERIAL NOT NULL, "liffId" character varying NOT NULL, "name" character varying, "description" character varying, "type" character varying, "channelId" character varying, "channelSecret" character varying, "token" character varying, "tokenExpire" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "lineProviderId" bigint, CONSTRAINT "UQ_7f445153cfb838662206e2151e1" UNIQUE ("hashId"), CONSTRAINT "UQ_783c76908b396f281ed8a642d95" UNIQUE ("liffId"), CONSTRAINT "REL_082e0df3c86af2ba3e64b846e4" UNIQUE ("lineProviderId"), CONSTRAINT "PK_ea0c6d76ffe65fa75cb523da06f" PRIMARY KEY ("id")); COMMENT ON COLUMN "liff_config"."tokenExpire" IS 'tokenの利用期限'`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_aedbaa2962ffeb408fe497829dd" FOREIGN KEY ("producerId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" ADD CONSTRAINT "FK_e5ee87fb994887a6f704b2176f0" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" ADD CONSTRAINT "FK_529dceb01ef681127fef04d755d" FOREIGN KEY ("userId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation_products" ADD CONSTRAINT "FK_1469d2b69aeae5bef7d60659e2e" FOREIGN KEY ("reservationId") REFERENCES "reservation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation_products" ADD CONSTRAINT "FK_c7d34dbac9e25811d9c0c77199a" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "line_config" ADD CONSTRAINT "FK_cf9314bedecaf6ab45ebb3db1ef" FOREIGN KEY ("lineProviderId") REFERENCES "line_provider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "line_provider" ADD CONSTRAINT "FK_2e9b8b873522fd798f152113971" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "liff_config" ADD CONSTRAINT "FK_082e0df3c86af2ba3e64b846e44" FOREIGN KEY ("lineProviderId") REFERENCES "line_provider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "liff_config" DROP CONSTRAINT "FK_082e0df3c86af2ba3e64b846e44"`,
    );
    await queryRunner.query(
      `ALTER TABLE "line_provider" DROP CONSTRAINT "FK_2e9b8b873522fd798f152113971"`,
    );
    await queryRunner.query(
      `ALTER TABLE "line_config" DROP CONSTRAINT "FK_cf9314bedecaf6ab45ebb3db1ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation_products" DROP CONSTRAINT "FK_c7d34dbac9e25811d9c0c77199a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation_products" DROP CONSTRAINT "FK_1469d2b69aeae5bef7d60659e2e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" DROP CONSTRAINT "FK_529dceb01ef681127fef04d755d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" DROP CONSTRAINT "FK_e5ee87fb994887a6f704b2176f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_aedbaa2962ffeb408fe497829dd"`,
    );
    await queryRunner.query(`DROP TABLE "liff_config"`);
    await queryRunner.query(`DROP TABLE "line_provider"`);
    await queryRunner.query(`DROP TABLE "line_config"`);
    await queryRunner.query(`DROP TABLE "shop"`);
    await queryRunner.query(`DROP TABLE "reservation_products"`);
    await queryRunner.query(`DROP TABLE "reservation"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "account"`);
  }
}
