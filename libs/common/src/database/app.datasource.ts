import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    name: 'connection_postgres',
    type: 'postgres',
    //   host:'192.168.35.45',
    host: 'postgres',
    port: 5432,
    database: 'pricing_database',
    username: 'admin',
    // password: 'LNC4UVJarBsczHgKPh',
    password: '123',
    entities: [
        'dist/**/*.entity.js',
        '**/*.entity.js'
    ],
    migrations: [
        'dist/migrations/*{.ts,.js}',
    ],
    synchronize: true,

});
let datasource: DataSource;
export const ConnectDB = async () => {
    datasource = await AppDataSource.initialize();
}
