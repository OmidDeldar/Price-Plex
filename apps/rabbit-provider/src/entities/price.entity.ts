
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'price' })
export class PriceEnt {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ default: '0' })
    diffrence: string

    @Column()
    from_crypto: string

    @Column({ default: '0' })
    from_decimal: string

    @Column()
    from_price: string

    @Column({ default: '0' })
    to_decimal: string

    @Column()
    to_crypto: string

    @Column()
    to_price: string

    @Column({ default: '0' })
    buy_from_exchange: string

    @Column({ default: '0' })
    sale_to_exchange: string

    @Column()
    insert_hour: number

    @CreateDateColumn({ update: false })
    create_at: Date;

    @CreateDateColumn({})
    update_at: Date;

    @DeleteDateColumn({})
    delete_at?: Date;
}