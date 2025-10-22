import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn } from "typeorm";
import { Wallet } from "./Wallet.entity.ts";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    document!: string;

    @Column()
    names!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ unique: true })
    phone!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @OneToOne(() => Wallet, wallet => wallet.user)
    wallet!: Wallet;
}
