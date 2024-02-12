import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigration1707666567654 implements MigrationInterface {
    name = 'MyMigration1707666567654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reply" ADD "threadId" integer`);
        await queryRunner.query(`ALTER TABLE "reply" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "reply" ADD CONSTRAINT "FK_9b7de6888ce703f13e4bbfe13b7" FOREIGN KEY ("threadId") REFERENCES "thread"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reply" ADD CONSTRAINT "FK_e9886d6d04a19413a2f0aac5d7b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reply" DROP CONSTRAINT "FK_e9886d6d04a19413a2f0aac5d7b"`);
        await queryRunner.query(`ALTER TABLE "reply" DROP CONSTRAINT "FK_9b7de6888ce703f13e4bbfe13b7"`);
        await queryRunner.query(`ALTER TABLE "reply" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "reply" DROP COLUMN "threadId"`);
    }

}
