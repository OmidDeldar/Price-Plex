import { Injectable, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { GlobalService } from "./global.service";
import { RedisOriginService } from "@app/common";
import { CryptoEnt } from "../dto/crypto.entity";
import { RedisExchangeDto } from "../dto/redis.exchange.dto";
import { ExchangeTypeEnum } from "../enums/exchange.type.enum";
import { CryptoPricingService } from "./crypto.pricing.service";
import { RedisPlusService } from "@app/common/redis/services/redis-plus.service";

@Injectable()
export class BotStableCoinService implements OnModuleInit{
    cryptoEntLists:CryptoEnt[]=[]
    PREFIX_PRICE_EXCHANGE_CRYPTO="prefix_price_exchange_crypto_"
    constructor(private redisService:RedisOriginService,
        private globalService:GlobalService,
        private cryptoPricingService:CryptoPricingService,
        private redisPlusService: RedisPlusService){}
    async onModuleInit() {
        const result=await this.globalService.cryptoList()
        const stableCoins=result.filter(item=>item?.stable_coin==true)
        this.cryptoEntLists=this.cryptoEntLists.concat(stableCoins)
    }
    
    @Cron(CronExpression.EVERY_SECOND)
  async runChangeStableCoins() {
    const lenStableCoins = this.cryptoEntLists.length
    for(let count = 0 ; count < lenStableCoins ; count++) {
      const row = this.cryptoEntLists[count]
      const  pattern =`${this.PREFIX_PRICE_EXCHANGE_CRYPTO}*${row.symbol_crypto.toLowerCase()}*`
      // console.log('row =>',row)
      // const resultKeys =await this.redisService.multiGetKeys(pattern)
      const resultKeys =await this.redisPlusService.getKeys(pattern)
      // console.log('resultKey =>',resultKeys)
      const lenKeys = resultKeys.length
      for (let countPattern =0 ;  countPattern < lenKeys;countPattern++ ) {
        const rowKeys = resultKeys[countPattern]
        const resultGetKey =<RedisExchangeDto> await this.redisService.getKey(rowKeys)
        if (resultGetKey!=null) {
          if ( resultGetKey.from_crypto==row.symbol_crypto.toLowerCase()) {
            resultGetKey.from_price='1'
          } else {
            resultGetKey.to_price='1'
          }
         await this.redisService.setKey(rowKeys ,JSON.stringify(resultGetKey) ,999999)
         if (resultGetKey.exchange_type.includes(ExchangeTypeEnum.OTC))
        await this.cryptoPricingService.sendToAllPriceCryptoOtc(resultGetKey)

       if (resultGetKey.exchange_type.includes(ExchangeTypeEnum.CONVERT))
          await this.cryptoPricingService.sendToAllPriceCryptoConvert(resultGetKey)
        }
      }
    }
  }
}