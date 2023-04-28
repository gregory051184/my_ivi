import {forwardRef, Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {GlobalModule, Role, User} from "@lib/global";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {AuthModule} from "../../auth_reg/src/auth/auth.module";
import {RolesModule} from "./roles/roles.module";


@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env'
        }),
        //SequelizeModule.forRoot({
        //    dialect: 'postgres',
        //    host: process.env.POSTGRES_HOST,
        //    port: Number(process.env.POSTGRES_PORT),
        //    username: process.env.POSTGRES_USER,
        //    password: process.env.POSTGRES_PASSWORD,
        //    database: "template1",
        //    models: [Role],
        //    autoLoadModels: true
        //}),
        SequelizeModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                dialect: "postgres",
                host: configService.get('POSTGRES_HOST'),
                port: +configService.get('POSTGRES_PORT'),
                username: configService.get('POSTGRES_USER'),
                password: configService.get('POSTGRES_PASSWORD'),
                database: "template1",
                models: [Role],
                autoLoadModels: true,
                synchronize: true
            }),

            inject: [ConfigService],
        }),
        RolesModule,
        GlobalModule,
        forwardRef(() =>AuthModule)
    ]

})

export class AppModule {
}