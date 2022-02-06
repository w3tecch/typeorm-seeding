import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
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
  address!: string

  @Column()
  email!: string

  @OneToMany(() => Pet, (pet) => pet.owner, {
    nullable: true,
  })
  pets?: Pet[]
}
