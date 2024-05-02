package advertisement.application.publishAdvertisement

import advertisement.domain.AdvertisementRepository
import advertisement.domain.model.Advertisement
import advertisement.domain.model.value_object.Password
import java.time.LocalDateTime

class PublishAdvertisementUseCase(private val advertisementRepository: AdvertisementRepository) {
    fun execute(addAdvertisementCommand: PublishAdvertisementCommand) {
        val advertisement = Advertisement(
            addAdvertisementCommand.id,
            addAdvertisementCommand.description,
            Password.fromPlainPassword(addAdvertisementCommand.password),
            LocalDateTime.now()
        )

        advertisementRepository.save(advertisement)
    }
}
