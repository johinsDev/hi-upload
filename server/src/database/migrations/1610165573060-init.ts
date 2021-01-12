import {MigrationInterface, QueryRunner} from "typeorm";

export class init1610165573060 implements MigrationInterface {
    name = 'init1610165573060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "path" character varying NOT NULL, "size" bigint NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "UQ_068984316f2b10a398fcdef59cb" UNIQUE ("path"), CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscription_usage" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "valid_until" TIMESTAMP, "used" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "subscription_id" uuid, "feature_id" uuid, CONSTRAINT "PK_6cca9752b083ee0533770af8121" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plan_features" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "value" character varying NOT NULL, "resettable_interval" character varying NOT NULL DEFAULT 'month', "resettable_period" smallint NOT NULL DEFAULT '0', "sort_order" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "plan_id" uuid, CONSTRAINT "UQ_65d9d67a4a48d135976227c89ac" UNIQUE ("slug"), CONSTRAINT "PK_eb2b32d1d93a8b2e96e122e3a77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "price" numeric NOT NULL DEFAULT '0', "signup_fee" numeric NOT NULL DEFAULT '0', "trial_period" smallint NOT NULL DEFAULT '0', "currency" character varying(3) NOT NULL, "trial_interval" character varying NOT NULL DEFAULT 'day', "invoice_period" smallint NOT NULL DEFAULT '0', "invoice_interval" character varying NOT NULL DEFAULT 'month', "grace_period" smallint NOT NULL DEFAULT '0', "grace_interval" character varying NOT NULL DEFAULT 'day', "prorate_day" smallint, "prorate_period" smallint, "prorate_extend_due" smallint, "active_subscribers_limit" smallint, "sort_order" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_3c212579e21a2c819a6281b5895" UNIQUE ("slug"), CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "trial_ends_at" TIMESTAMP, "starts_at" TIMESTAMP, "ends_at" TIMESTAMP, "cancels_at" TIMESTAMP, "canceled_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer, "plan_id" uuid, CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "email_verified_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_516f1cf15166fd07b732b4b6ab0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "subscription_usage" ADD CONSTRAINT "FK_9770faf7a509dc7950e97f49b99" FOREIGN KEY ("subscription_id") REFERENCES "subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "subscription_usage" ADD CONSTRAINT "FK_2195da451933dd85744726977aa" FOREIGN KEY ("feature_id") REFERENCES "plan_features"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "plan_features" ADD CONSTRAINT "FK_b51952483b18fa15334d714a838" FOREIGN KEY ("plan_id") REFERENCES "plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_940d49a105d50bbd616be540013" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_5fde988e5d9b9a522d70ebec27c" FOREIGN KEY ("plan_id") REFERENCES "plan"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_e50ca89d635960fda2ffeb17639" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_e50ca89d635960fda2ffeb17639"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_5fde988e5d9b9a522d70ebec27c"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_940d49a105d50bbd616be540013"`);
        await queryRunner.query(`ALTER TABLE "plan_features" DROP CONSTRAINT "FK_b51952483b18fa15334d714a838"`);
        await queryRunner.query(`ALTER TABLE "subscription_usage" DROP CONSTRAINT "FK_2195da451933dd85744726977aa"`);
        await queryRunner.query(`ALTER TABLE "subscription_usage" DROP CONSTRAINT "FK_9770faf7a509dc7950e97f49b99"`);
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_516f1cf15166fd07b732b4b6ab0"`);
        await queryRunner.query(`DROP TABLE "token"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "subscription"`);
        await queryRunner.query(`DROP TABLE "plan"`);
        await queryRunner.query(`DROP TABLE "plan_features"`);
        await queryRunner.query(`DROP TABLE "subscription_usage"`);
        await queryRunner.query(`DROP TABLE "file"`);
    }

}
