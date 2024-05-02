package advertisement.application.publishAdvertisement

import advertisement.domain.AdvertisementRepository
import advertisement.domain.model.Advertisement
import java.time.LocalDateTime

class PublishAdvertisementUseCase(private val advertisementRepository: AdvertisementRepository) {
    fun execute(publishAdvertisementCommand: PublishAdvertisementCommand) {
        val advertisement = Advertisement(
            publishAdvertisementCommand.id,
            publishAdvertisementCommand.description,
            publishAdvertisementCommand.password,
            LocalDateTime.now()
        )

        advertisementRepository.save(advertisement)
    }
}
