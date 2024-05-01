package advertisement.application.renewAdvertisement

import advertisement.domain.AdvertisementRepository

class RenewAdvertisementUseCase(private val advertisementRepository: AdvertisementRepository) {
    fun execute(renewAdvertisementCommand: RenewAdvertisementCommand) {
        val advertisement = advertisementRepository.findById(renewAdvertisementCommand.id)

        advertisement.renew()

        advertisementRepository.save(advertisement)
    }
}
