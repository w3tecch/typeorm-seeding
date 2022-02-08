import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm'
import { Country } from './Country.entity'
import { Pet } from './Pet.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id!: number

  @Column()
  name!: string

  @Column()
  lastName!: string

  @Column()
  email!: string

  @OneToMany(() => Pet, (pet) => pet.owner)
  pets?: Pet[]

  @ManyToOne(() => Country, (country) => country.users, { nullable: false })
  @JoinColumn()
  country!: Country
}
