import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id!: number

  @Column()
  name!: string

  @Column()
  lastName!: string

  @Column()
  phone!: number
}
