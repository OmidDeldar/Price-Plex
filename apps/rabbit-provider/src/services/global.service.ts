import { Injectable, OnModuleInit } from "@nestjs/common";
import { CryptoEnt } from "../dto/crypto.entity";
import { ResponseCrypto } from "../response/crypto.response";

const axios = require("axios")

@Injectable()
export class GlobalService {
   constructor() {
   }

   async cryptoList(): Promise<CryptoEnt[]> {
      try {
         const cryptoListReq = await axios.get("https://api-de.novintex.com/api/v1/crypto/list/cryptos")
         const responseAxios: ResponseCrypto = cryptoListReq.data
         const cryptoList: CryptoEnt[] = responseAxios.data
         return cryptoList
      } catch (error) {
      }
   }

   async priceIrr(): Promise<number> {
      try {
         const priceRq = await axios.get(`https://api.tetherland.com/currencies`)
         const result = priceRq.data
         const tetherPrice = result.data.currencies.USDT.price
         //   find(item=>item.name=='Tether' && item.symbol=='USDT').toman_amount
         return tetherPrice * 10
      } catch (error) {
      }
   }
}