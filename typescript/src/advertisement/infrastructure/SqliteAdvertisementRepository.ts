import { AdvertisementRepository } from '../domain/AdvertisementRepository';
import { Advertisement } from '../domain/model/Advertisement';
import { createHash } from "node:crypto";
import { DatabaseConnection } from '../../framework/database/DatabaseConnection';

export class SqliteAdvertisementRepository implements AdvertisementRepository {

  constructor(
    private connection: DatabaseConnection) {
  }

  async findById(id: string): Promise<Advertisement> {

    const result = await this.connection.query(`SELECT * FROM advertisements WHERE id = ? `, [id])

    if (!result || result.length < 1) {
      throw new Error('Advertisement not found');
    }

    const row = result[0] as any;
    return new Advertisement(
      row.id,
      row.description,
      row.password,
      new Date(row.advertisement_date)
    )

  }

  async save(advertisement: Advertisement): Promise<void> {

    await this.connection.execute(
      `INSERT INTO advertisements (id, description, password, advertisement_date) 
      VALUES (?, ?, ?, ?) 
      ON CONFLICT(id) DO UPDATE 
      SET description = excluded.description, password = excluded.password, advertisement_date = excluded.advertisement_date`, [
      advertisement.id(),
      advertisement.description(),
      createHash('md5').update(advertisement.password()).digest('hex'),
      advertisement.date().toISOString(),
    ]);

  }
}
