// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { ChatMessage, Room } = initSchema(schema);

export {
  ChatMessage,
  Room
};