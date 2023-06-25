import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { CreatePriceDto } from "../dto/create-price.dto";
import { PriceEnt } from "../entities/price.entity";
import { Between } from 'typeorm';

export class PriceRepo {
    constructor(
        @InjectDataSource()
        private dataSource: DataSource
    ) {
    }

    async createEntity(createDto: CreatePriceDto) {
        const priceEnt = new PriceEnt();
        priceEnt.diffrence = createDto.diffrence;
        priceEnt.from_crypto = createDto.from_crypto;
        priceEnt.from_decimal = createDto.from_decimal;
        priceEnt.from_price = createDto.from_price;
        priceEnt.to_crypto = createDto.to_crypto;
        priceEnt.to_decimal = createDto.to_decimal;
        priceEnt.to_price = createDto.to_price;
        priceEnt.buy_from_exchange = createDto.buy_from_exchange;
        priceEnt.sale_to_exchange = createDto.sale_to_exchange;
        priceEnt.insert_hour = createDto.insert_hour;
        return await this.dataSource.manager.save(priceEnt);
    }


    async findOneByCryptos(from: string, to: string) {
        try {
            const hour = new Date(Date.now()).getHours();
            return await this.dataSource.manager.findOne(PriceEnt, {
                where: { from_crypto: from, to_crypto: to, insert_hour: hour },
                order: { create_at: 'DESC' }
            })
        } catch (error) {

        }

    }
}

