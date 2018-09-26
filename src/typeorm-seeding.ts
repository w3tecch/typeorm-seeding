import 'reflect-metadata';

import { EntityFactory } from './entity-factory';

export const greet = () => console.log('Hello, world?!', EntityFactory);
