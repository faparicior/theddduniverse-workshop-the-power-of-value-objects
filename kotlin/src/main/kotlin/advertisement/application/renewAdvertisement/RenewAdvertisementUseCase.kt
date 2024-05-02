package advertisement.application.renewAdvertisement

import advertisement.domain.AdvertisementRepository
import java.security.MessageDigest

class RenewAdvertisementUseCase(private val advertisementRepository: AdvertisementRepository) {
    fun execute(renewAdvertisementCommand: RenewAdvertisementCommand) {
        val advertisement = advertisementRepository.findById(renewAdvertisementCommand.id)

        if (advertisement.password != renewAdvertisementCommand.password.md5())
            return

        advertisement.renew()

        advertisementRepository.save(advertisement)
    }

    private fun String.md5(): String {
        val md = MessageDigest.getInstance("MD5")
        val digest = md.digest(this.toByteArray())
        return digest.toString()
    }
}
