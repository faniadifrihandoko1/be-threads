import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigration1707667093412 implements MigrationInterface {
    name = 'MyMigration1707667093412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "like" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "like" ADD "threadId" integer`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_e8fb739f08d47955a39850fac23" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_52e479f76c8fa698540cb792f37" FOREIGN KEY ("threadId") REFERENCES "thread"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_52e479f76c8fa698540cb792f37"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_e8fb739f08d47955a39850fac23"`);
        await queryRunner.query(`ALTER TABLE "like" DROP COLUMN "threadId"`);
        await queryRunner.query(`ALTER TABLE "like" DROP COLUMN "userId"`);
    }

}
