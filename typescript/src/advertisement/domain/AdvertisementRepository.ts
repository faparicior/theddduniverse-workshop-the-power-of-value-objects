import { Advertisement } from "./model/Advertisement";

export interface AdvertisementRepository {

  save(name: Advertisement): Promise<void>;

  findById(id: string): Promise<Advertisement>;
}
