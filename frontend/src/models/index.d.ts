import {
  ModelInit,
  MutableModel,
  PersistentModelConstructor,
} from '@aws-amplify/datastore'

type ChatMessageMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt'
}

type RoomMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt'
}

export declare class ChatMessage {
  readonly id: string
  readonly type?: string | null
  readonly data?: string | null
  readonly chanelId?: string | null
  readonly sendId?: string | null
  readonly datetime?: string | null
  readonly readed?: boolean | null
  readonly createdAt?: string | null
  readonly updatedAt?: string | null
  constructor(init: ModelInit<ChatMessage, ChatMessageMetaData>)
  static copyOf(
    source: ChatMessage,
    mutator: (
      draft: MutableModel<ChatMessage, ChatMessageMetaData>
    ) => MutableModel<ChatMessage, ChatMessageMetaData> | void
  ): ChatMessage
}

export declare class Room {
  readonly id: string
  readonly name: string
  readonly description?: string | null
  readonly createdAt?: string | null
  readonly updatedAt?: string | null
  constructor(init: ModelInit<Room, RoomMetaData>)
  static copyOf(
    source: Room,
    mutator: (
      draft: MutableModel<Room, RoomMetaData>
    ) => MutableModel<Room, RoomMetaData> | void
  ): Room
}
