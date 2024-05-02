package advertisement.application.updateAdvertisement

import advertisement.domain.AdvertisementRepository

class UpdateAdvertisementUseCase(private val advertisementRepository: AdvertisementRepository) {
    fun execute(updateAdvertisementCommand: UpdateAdvertisementCommand) {
        val advertisement = advertisementRepository.findById(updateAdvertisementCommand.id)

        if (!advertisement.password?.isValidatedWith(updateAdvertisementCommand.password)!!)
            return

        advertisement.update(updateAdvertisementCommand.description)

        advertisementRepository.save(advertisement)
    }
}
