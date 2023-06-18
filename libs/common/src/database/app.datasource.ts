import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    name: 'connection_postgres',
    type: 'postgres',
    host:'192.168.35.45',
    port: 5432,
    database:'memphis_pricing',
    username: 'postgres',
    password: 'LNC4UVJarBsczHgKPh',
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
