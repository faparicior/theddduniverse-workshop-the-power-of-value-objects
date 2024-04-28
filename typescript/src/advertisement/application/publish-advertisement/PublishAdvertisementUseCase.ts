import { AdvertisementRepository } from "../../domain/AdvertisementRepository";
import { Advertisement } from "../../domain/model/Advertisement";
import { PublishAdvertisementCommand } from "./PublishAdvertisementCommand";
import {Password} from "../../domain/model/value-object/Password";

export class PublishAdvertisementUseCase {

  constructor(
    private advertisementRepository: AdvertisementRepository
  ) {

  }

  async execute(command: PublishAdvertisementCommand): Promise<void> {
    const advertisement = new Advertisement(
      command.id,
      command.description,
      await Password.fromPlainPassword(command.password),
      new Date()
    )

    await this.advertisementRepository.save(advertisement)
  }
}
