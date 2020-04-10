import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { Pet } from './Pet.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  email: string

  @OneToMany((type) => Pet, (pet) => pet.user)
  pets: Pet[]
}
