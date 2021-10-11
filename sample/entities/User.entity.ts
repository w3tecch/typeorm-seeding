import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BeforeInsert } from 'typeorm'
import { LabelingTicket } from './LabelingTicket.entity'
// import * as bcrypt from 'bcryptjs'
// import { Pet } from './Pet.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  username: string

  @Column()
  isSuperuser: boolean

  @OneToMany(() => LabelingTicket, (labelingTicket) => labelingTicket.user)
  labelingTickets: LabelingTicket[]

  // @Column({ type: 'varchar', length: 100, nullable: false })
  // password: string

  // @BeforeInsert()
  // async setPassword(password: string) {
  //   const salt = await bcrypt.genSalt()
  //   this.password = await bcrypt.hash(password || this.password, salt)
  // }
}
