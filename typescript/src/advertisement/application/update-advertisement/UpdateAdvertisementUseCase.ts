import { AdvertisementRepository } from "../../domain/AdvertisementRepository"
import { Advertisement } from "../../domain/model/Advertisement"
import { UpdateAdvertisementCommand } from "./UpdateAdvertisementCommand"

export class UpdateAdvertisementUseCase {

  constructor(
    private advertisementRepository: AdvertisementRepository
  ) {

  }

  async execute(command: UpdateAdvertisementCommand): Promise<void> {


    const advertisement = await this.advertisementRepository.findById(command.id)

    //TODO: update 
    advertisement.update(command.description, command.password)

    await this.advertisementRepository.save(advertisement)

  }

}
