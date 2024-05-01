package advertisement.application.updateAdvertisement

import advertisement.domain.AdvertisementRepository

class UpdateAdvertisementUseCase(private val advertisementRepository: AdvertisementRepository) {
    fun execute(addAdvertisementCommand: UpdateAdvertisementCommand) {
        val advertisement = advertisementRepository.findById(addAdvertisementCommand.id)

        advertisement.update(addAdvertisementCommand.description)

        advertisementRepository.save(advertisement)
    }
}
