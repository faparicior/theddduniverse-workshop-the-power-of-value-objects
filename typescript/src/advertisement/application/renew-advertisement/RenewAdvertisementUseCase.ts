import { AdvertisementRepository } from "../../domain/AdvertisementRepository"
import { RenewAdvertisementCommand } from "./RenewAdvertisementCommand"
import {createHash} from "node:crypto";

export class RenewAdvertisementUseCase {

  constructor(
    private advertisementRepository: AdvertisementRepository
  ) {

  }

  async execute(command: RenewAdvertisementCommand): Promise<void> {
    const advertisement = await this.advertisementRepository.findById(command.id)

    if (advertisement.password() !== createHash('md5').update(command.password).digest('hex')) {
      return
    }

    advertisement.renew()

    await this.advertisementRepository.save(advertisement)
  }
}
