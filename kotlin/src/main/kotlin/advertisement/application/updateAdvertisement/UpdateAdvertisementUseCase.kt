package advertisement.application.updateAdvertisement

import advertisement.domain.AdvertisementRepository
import java.security.MessageDigest

class UpdateAdvertisementUseCase(private val advertisementRepository: AdvertisementRepository) {
    fun execute(updateAdvertisementCommand: UpdateAdvertisementCommand) {
        val advertisement = advertisementRepository.findById(updateAdvertisementCommand.id)

        if (advertisement.password != updateAdvertisementCommand.password.md5())
            return

        advertisement.update(updateAdvertisementCommand.description)

        advertisementRepository.save(advertisement)
    }

    private fun String.md5(): String {
        val md = MessageDigest.getInstance("MD5")
        val digest = md.digest(this.toByteArray())
        val hexString = digest.joinToString("") { "%02x".format(it) }
        return hexString
    }
}
