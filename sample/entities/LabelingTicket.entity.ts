import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BeforeInsert, ManyToOne } from 'typeorm'
import { User } from './User.entity'

@Entity()
export class LabelingTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @ManyToOne(() => User, (user) => user.labelingTickets)
  user: User
}
