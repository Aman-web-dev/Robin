import { MikroORM } from '@mikro-orm/core';
import config from '../../micro-orm.config'

let orm: MikroORM | null = null;

export async function initMikroORM() {
  if (!orm) {
    orm = await MikroORM.init(config);
  }
  return orm;
}

export async function getORM() {
  if (!orm) {
    await initMikroORM();
  }
  return orm!;
}