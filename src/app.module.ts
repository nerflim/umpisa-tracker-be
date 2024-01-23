import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ProjectModule } from './project/project.module';
import { CategoryModule } from './category/category.module';
import { CardModule } from './card/card.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://umpisa:umpisa123@umpisa.xtd9wz9.mongodb.net/?retryWrites=true&w=majority',
    ),
    ProjectModule,
    CategoryModule,
    CardModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      include: [ProjectModule, CategoryModule, CardModule],
      autoSchemaFile: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
