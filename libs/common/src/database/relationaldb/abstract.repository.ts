import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasourceOptions } from 'typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(datasourceOptions)],
})
export class RelationalDatabaseModule {}
