import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id!: string

  @Column()
  name!: string
}
