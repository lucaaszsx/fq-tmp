import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent
} from 'typeorm';

@EventSubscriber()
export class TimestampSubscriber implements EntitySubscriberInterface {
    beforeInsert(event: InsertEvent<any>): Promise<any> | void {
        if (event.entity) {
            event.entity.createdAt = new Date();
            event.entity.updatedAt = new Date();
        }
    }

    beforeUpdate(event: UpdateEvent<any>): Promise<any> | void {
        if (event.entity)
            event.entity.updatedAt = new Date();
    }
}