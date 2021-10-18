import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BeforeInsert } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { Pet } from './Pet.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  firstName!: string

  @Column()
  lastName!: string

  @Column({ type: 'varchar', nullable: true })
  middleName!: string | null

  @Column()
  email!: string

  @OneToMany((type) => Pet, (pet) => pet.user)
  pets!: Pet[]

  @Column({ type: 'varchar', length: 100, nullable: false })
  password!: string

  @BeforeInsert()
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(password || this.password, salt)
  }
}
