import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigration1707666094946 implements MigrationInterface {
    name = 'MyMigration1707666094946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_fb3a87f3c6ccb321db8e7b7f07b"`);
        await queryRunner.query(`ALTER TABLE "following" DROP CONSTRAINT "FK_fc4cbf2396bf4bb1df9ecb3cc4a"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "followerId"`);
        await queryRunner.query(`ALTER TABLE "following" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "following" ADD "followingId" integer`);
        await queryRunner.query(`ALTER TABLE "following" ADD "followerId" integer`);
        await queryRunner.query(`ALTER TABLE "following" ADD CONSTRAINT "FK_80463ab7e0c3ed2868a59816af8" FOREIGN KEY ("followingId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "following" ADD CONSTRAINT "FK_6516c5a6f3c015b4eed39978be5" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "following" DROP CONSTRAINT "FK_6516c5a6f3c015b4eed39978be5"`);
        await queryRunner.query(`ALTER TABLE "following" DROP CONSTRAINT "FK_80463ab7e0c3ed2868a59816af8"`);
        await queryRunner.query(`ALTER TABLE "following" DROP COLUMN "followerId"`);
        await queryRunner.query(`ALTER TABLE "following" DROP COLUMN "followingId"`);
        await queryRunner.query(`ALTER TABLE "following" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD "followerId" integer`);
        await queryRunner.query(`ALTER TABLE "following" ADD CONSTRAINT "FK_fc4cbf2396bf4bb1df9ecb3cc4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_fb3a87f3c6ccb321db8e7b7f07b" FOREIGN KEY ("followerId") REFERENCES "following"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
