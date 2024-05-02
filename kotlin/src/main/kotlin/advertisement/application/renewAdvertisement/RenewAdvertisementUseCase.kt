package advertisement.application.renewAdvertisement

import advertisement.domain.AdvertisementRepository
import advertisement.domain.model.value_object.Password

class RenewAdvertisementUseCase(private val advertisementRepository: AdvertisementRepository) {
    fun execute(renewAdvertisementCommand: RenewAdvertisementCommand) {
        val advertisement = advertisementRepository.findById(renewAdvertisementCommand.id)

        if (!advertisement.password?.isValidatedWith(renewAdvertisementCommand.password)!!)
            return

        advertisement.renew(Password.fromPlainPassword(renewAdvertisementCommand.password))

        advertisementRepository.save(advertisement)
    }
}
