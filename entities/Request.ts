import { Entity, PrimaryKey, Property, ManyToOne} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import {User} from './User';

@Entity({collection:"request"})
export class Request {
  @PrimaryKey()
  _id: ObjectId = new ObjectId();

  
  @ManyToOne(() => User)
  user!: User;

  @Property()
  request_url!: string;

  @Property()
  method!: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

  @Property({ type: 'json' })
  headers!: Record<string, string>;

  @Property({ type: 'json', nullable: true })
  body?: any;

  @Property({ nullable: true })
  body_raw?: string;

  @Property({ type: 'json', nullable: true })
  query_params?: Record<string, string>;

  @Property({ type: 'json', nullable: true })
  path_params?: Record<string, string>;

  @Property({ type: 'json', nullable: true })
  authentication?: {
    type: 'Bearer' | 'Basic' | 'APIKey' | 'None';
    token?: string;
  };

  @Property({ nullable: true })
  timeout?: number;

  @Property({ nullable: true })
  content_type?: string;

  @Property({ nullable: true })
  accept?: string;

  @Property({ type: 'json', nullable: true })
  response?: {
    status: number;
    status_text: string;
    headers: Record<string, string>;
    data?: any;
    data_raw?: string;
    time_taken?: number;
  };

  @Property()
  timestamp!: string;

  @Property()
  request_id!: string;

  @Property({ nullable: true })
  name?: string;

  @Property({ nullable: true })
  retries?: number;

  @Property({ nullable: true })
  environment?: 'development' | 'staging' | 'production';

  @Property({ nullable: true })
  client_ip?: string;

  @Property({ nullable: true })
  user_agent?: string;

  @Property({ type: 'json', nullable: true })
  error?: {
    message: string;
    code?: string;
    details?: any;
  };

  @Property()
  createdAt: Date = new Date();
}