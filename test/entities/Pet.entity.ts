import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm'
import { User } from './User.entity'

@Entity()
export class Pet {
  @PrimaryGeneratedColumn('increment')
  id!: string

  @Column()
  name!: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  owner!: User
}
