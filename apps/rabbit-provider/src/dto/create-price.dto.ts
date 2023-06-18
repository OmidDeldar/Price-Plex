import { Allow } from "class-validator"

export class CreatePriceDto {
    @Allow()
    diffrence?: string

    @Allow()
    from_crypto: string

    @Allow()
    from_decimal?: string

    @Allow()
    from_price: string

    @Allow()
    to_decimal?: string

    @Allow()
    to_crypto: string

    @Allow()
    to_price: string

    @Allow()
    buy_from_exchange?: string

    @Allow()
    sale_to_exchange?: string

    @Allow()
    insert_hour?: number
}