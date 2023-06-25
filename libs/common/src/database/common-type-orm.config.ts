import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { PriceEnt } from "apps/rabbit-provider/src/entities/price.entity";
import { DataSource, DataSourceOptions } from "typeorm";
const defaultDatabaseOptions = {
    // logger: new DatabaseLogger(),
    synchronize: process.env.DB_SYNCHRONIZE === 'true' || false,
    migrationsTableName: 'migrations',
};

export const OrmConfigModulePostgres= {
    useFactory:async (configService: ConfigService) => {
        const options:TypeOrmModuleOptions={
            name: 'connection_postgres',
            type: 'postgres',
            host:'192.168.35.45',
            port: 5432,
            database:'memphis_pricing',
            username: 'postgres',
            password: 'LNC4UVJarBsczHgKPh',
            // host: configService.get<string>('DB_HOST',), 
            // port: configService.get<number>('DB_PORT',5432),
            // database: configService.get<string>('DB_DATABASE','pricing_database'),
            // username: configService.get<string>('DB_USERNAME'),
            // password: configService.get<string>('DB_PASSWORD'),
            entities: [ 
                'dist/**/*.entity.js',
                '**/*.entity.js',
                PriceEnt
            ],
            synchronize:true,
            autoLoadEntities: true,
        }
  
      return options;
          
      },

      
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },

}

