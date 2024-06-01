import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractMongoRepository<
  TDocument extends AbstractDocument,
> {
  protected abstract readonly logger: Logger;
  constructor(protected readonly model: Model<TDocument>) {}
  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  async findOne(filteredQuery: FilterQuery<TDocument>): Promise<TDocument> {
    // by default mongooose return with hydrated document which is document of bunch of internal mongoose docuent and internal properties and we dont want them
    const document = await this.model
      .findOne(filteredQuery)
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn(
        'Document was not found with the filtered query',
        filteredQuery,
      );
      throw new NotFoundException('Document was not found ');
    }
    return document;
  }

  async findOneAndUpdate(
    filteredQuery: FilterQuery<TDocument>,
    updateQuery: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filteredQuery, updateQuery, {
        new: true,
      })
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn(
        'Document was not found with the filtered query',
        filteredQuery,
      );
      throw new NotFoundException('Document was not found ');
    }

    return document;
  }

  async find(filteredQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(filteredQuery).lean<TDocument[]>(true);
  }

  async findOneAndDelete(
    filtedQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    return await this.model.findOneAndDelete(filtedQuery).lean<TDocument>(true);
  }
}
