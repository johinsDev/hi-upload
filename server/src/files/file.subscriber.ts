import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  RemoveEvent,
} from 'typeorm';
import { File } from './file.entity';
import S3Service from './s3.service';

@EventSubscriber()
export class FileSubscriber implements EntitySubscriberInterface<File> {
  constructor(connection: Connection, private readonly storage: S3Service) {
    connection.subscribers.push(this);
  }

  listenTo(): any {
    return File;
  }

  afterRemove(event: RemoveEvent<File>): void {
    this.storage.delete(event.entity.path);
  }
}
