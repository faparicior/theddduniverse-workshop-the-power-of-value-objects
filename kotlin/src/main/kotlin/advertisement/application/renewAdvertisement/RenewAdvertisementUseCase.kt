package advertisement.application.renewAdvertisement

import advertisement.domain.AdvertisementRepository
import advertisement.domain.model.value_object.Password
import advertisement.infrastructure.PasswordHasher

class RenewAdvertisementUseCase(private val advertisementRepository: AdvertisementRepository, private val passwordHasher: PasswordHasher) {
    fun execute(renewAdvertisementCommand: RenewAdvertisementCommand) {
        val advertisement = advertisementRepository.findById(renewAdvertisementCommand.id)

        if (!advertisement.password?.validateWith(renewAdvertisementCommand.password, passwordHasher)!!)
            return

        advertisement.renew(Password.fromPlainPassword(renewAdvertisementCommand.password, passwordHasher))

        advertisementRepository.save(advertisement)
    }
}
