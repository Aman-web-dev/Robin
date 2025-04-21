import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity({ collection: "User" })
export class User {
  @PrimaryKey()
  _id: ObjectId = new ObjectId();

  @Property({unique: true})
  name!: string;

  @Property({unique: true})
  email!: string;

  @Property()
  password!: string;

  @Property()
  createdAt: Date = new Date();
}