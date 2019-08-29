import * as bcrypt from "bcryptjs";
import { Field, ObjectType, Root, ID } from "type-graphql";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field({ nullable: true })
  @Column("varchar", { default: false, length: 130, nullable: true })
  firstname?: string;

  @Field({ nullable: true })
  @Column("varchar", { default: false, length: 125, nullable: true })
  lastname?: string;

  @Field({ nullable: true })
  @Column("varchar", { length: 255, nullable: true, unique: true })
  email?: string;

  @Column("text", { nullable: true })
  password?: string;

  @Column("boolean", { default: false })
  confirmed: boolean;

  @Column("text", { nullable: true })
  twitterId?: string;

  @Column("text", { nullable: true })
  facebookId?: string;

  @Column("text", { nullable: true })
  googleId?: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  @Field()
  name(@Root() parent: User): string {
    return `${parent.firstname} ${parent.lastname}`;
  }
}
