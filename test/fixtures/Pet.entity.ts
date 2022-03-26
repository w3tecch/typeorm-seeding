import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm'
import { User } from './User.entity'

@Entity()
export class Pet {
  @PrimaryGeneratedColumn('increment')
  id!: string

  @Column()
  name!: string

  @ManyToOne(() => User, (user) => user.pets)
  @JoinColumn({ name: 'owner_id' })
  owner!: User
}
