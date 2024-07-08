package advertisement.application.updateAdvertisement

import advertisement.domain.AdvertisementRepository
import advertisement.domain.model.value_object.Password
import advertisement.infrastructure.PasswordHasher

class UpdateAdvertisementUseCase(private val advertisementRepository: AdvertisementRepository, private val passwordHasher: PasswordHasher) {
    fun execute(updateAdvertisementCommand: UpdateAdvertisementCommand) {
        val advertisement = advertisementRepository.findById(updateAdvertisementCommand.id)

        if (!advertisement.password?.validateWith(updateAdvertisementCommand.password, passwordHasher)!!)
            return

        advertisement.update(
            updateAdvertisementCommand.description,
            Password.fromPlainPassword(updateAdvertisementCommand.password, passwordHasher)
        )

        advertisementRepository.save(advertisement)
    }
}
