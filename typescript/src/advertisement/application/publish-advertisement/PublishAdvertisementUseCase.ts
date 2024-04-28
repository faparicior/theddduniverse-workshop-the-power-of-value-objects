import { AdvertisementRepository } from "../../domain/AdvertisementRepository";
import { Advertisement } from "../../domain/model/Advertisement";
import { PublishAdvertisementCommand } from "./PublishAdvertisementCommand";

export class PublishAdvertisementUseCase {

  constructor(
    private advertisementRepository: AdvertisementRepository
  ) {

  }

  async execute(command: PublishAdvertisementCommand): Promise<void> {
    const advertisement = new Advertisement(
      command.id,
      command.description,
      command.password,
      new Date()
    )

    await this.advertisementRepository.save(advertisement)

  }

}
