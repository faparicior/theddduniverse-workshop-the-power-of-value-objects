import { AdvertisementRepository } from "../../domain/AdvertisementRepository"
import { UpdateAdvertisementCommand } from "./UpdateAdvertisementCommand"
import {Password} from "../../domain/model/value-object/Password";

export class UpdateAdvertisementUseCase {

  constructor(
    private advertisementRepository: AdvertisementRepository
  ) {

  }

  async execute(command: UpdateAdvertisementCommand): Promise<void> {
    const advertisement = await this.advertisementRepository.findById(command.id)

    if (!await advertisement.password().isValid(command.password)) {
      return
    }

    advertisement.update(command.description, await Password.fromPlainPassword(command.password))

    await this.advertisementRepository.save(advertisement)
  }
}
