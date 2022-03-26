import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { Pet } from './Pet.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id!: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @Column()
  name!: string

  @Column({ name: 'last_name' })
  lastName!: string

  @Column({ name: 'second_last_name', nullable: true })
  secondLastName?: string

  @Column()
  age!: number

  @Column()
  email!: string

  @OneToMany(() => Pet, (pet) => pet.owner)
  pets!: Pet[]
}
