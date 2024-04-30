import { AdvertisementRepository } from "../../domain/AdvertisementRepository"
import { RenewAdvertisementCommand } from "./RenewAdvertisementCommand"
import {Password} from "../../domain/model/value-object/Password";

export class RenewAdvertisementUseCase {

  constructor(
    private advertisementRepository: AdvertisementRepository
  ) {

  }

  async execute(command: RenewAdvertisementCommand): Promise<void> {
    const advertisement = await this.advertisementRepository.findById(command.id)

    if (!await advertisement.password().isValid(command.password)) {
      return
    }

    advertisement.renew(await Password.fromPlainPassword(command.password))

    await this.advertisementRepository.save(advertisement)
  }
}
