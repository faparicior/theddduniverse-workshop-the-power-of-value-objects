import { AdvertisementRepository } from "../../domain/AdvertisementRepository"
import { UpdateAdvertisementCommand } from "./UpdateAdvertisementCommand"
import {createHash} from "node:crypto";

export class UpdateAdvertisementUseCase {

  constructor(
    private advertisementRepository: AdvertisementRepository
  ) {

  }

  async execute(command: UpdateAdvertisementCommand): Promise<void> {
    const advertisement = await this.advertisementRepository.findById(command.id)

    if (advertisement.password() !== createHash('md5').update(command.password).digest('hex')) {
      return
    }

    advertisement.update(command.description)

    await this.advertisementRepository.save(advertisement)
  }
}
