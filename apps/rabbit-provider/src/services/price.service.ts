import { Injectable } from "@nestjs/common";
import { CreatePriceDto } from "../dto/create-price.dto";
import { PriceRepo } from "../repositories/price.repository";


@Injectable()
export class PriceService {
    constructor(private priceRepo: PriceRepo){}

    async createEntity(createDto: CreatePriceDto){
        const findOneByCryptos = await this.findOneByCryptos(createDto.from_crypto,createDto.to_crypto);
        createDto.insert_hour = new Date(Date.now()).getHours();
        if(findOneByCryptos){
            const result = await this.calculatePercentageDifference(Number(createDto.buy_from_exchange),Number(findOneByCryptos.buy_from_exchange));
            createDto.diffrence = result.toFixed(2);
        }
        return await this.priceRepo.createEntity(createDto)
    }


    async findOneByCryptos(from: string,to: string){
        return await this.priceRepo.findOneByCryptos(from,to);
    }

    async calculatePercentageDifference(oldValue: number, newValue: number):Promise<number> {
        const diff = Math.abs(oldValue - newValue);
        const average = (oldValue + newValue) / 2;
        const percentageDiff = (diff / average) * 100;
        return percentageDiff;
      }
}