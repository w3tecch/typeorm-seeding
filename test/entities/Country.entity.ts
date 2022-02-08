import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { User } from './User.entity'

@Entity()
export class Country {
  @PrimaryGeneratedColumn('increment')
  id!: number

  @Column()
  name!: string

  @Column()
  isoCode!: string

  @OneToMany(() => User, (user) => user.country)
  users?: User[]
}
