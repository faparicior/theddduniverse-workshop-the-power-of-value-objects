package advertisement.application.updateAdvertisement

import advertisement.domain.AdvertisementRepository
import java.security.MessageDigest

class UpdateAdvertisementUseCase(private val advertisementRepository: AdvertisementRepository) {
    fun execute(addAdvertisementCommand: UpdateAdvertisementCommand) {
        val advertisement = advertisementRepository.findById(addAdvertisementCommand.id)

        if (advertisement.password != addAdvertisementCommand.password.md5())
            return

        advertisement.update(addAdvertisementCommand.description)

        advertisementRepository.save(advertisement)
    }

    private fun String.md5(): String {
        val md = MessageDigest.getInstance("MD5")
        val digest = md.digest(this.toByteArray())
        return digest.toString()
    }
}
