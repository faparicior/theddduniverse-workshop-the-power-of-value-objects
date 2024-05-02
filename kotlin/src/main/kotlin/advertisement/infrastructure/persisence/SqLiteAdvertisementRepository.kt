package advertisement.infrastructure.persisence

import advertisement.domain.AdvertisementRepository
import advertisement.domain.model.Advertisement
import framework.database.DatabaseConnection
import java.security.MessageDigest
import java.time.LocalDateTime

class SqLiteAdvertisementRepository(private val connection: DatabaseConnection): AdvertisementRepository {
    override fun save(advertisement: Advertisement) {
        val passwordHash = advertisement.password!!.md5()
        connection.execute(
            "INSERT INTO advertisements (id, description, password, advertisement_date) VALUES ('" +
                    "${advertisement.id}', '${advertisement.description}', '$passwordHash', '${advertisement.date}') " +
                    "ON CONFLICT(id) DO UPDATE SET description = '${advertisement.description}', password = '$passwordHash', advertisement_date = '${advertisement.date}';"
        )
    }

    override fun findById(id: String): Advertisement {
        val result = connection.query(
            "SELECT * FROM advertisements WHERE id = '${id}'"
        )

        if (!result.next()) {
            throw Exception("Advertisement not found")
        }

        return Advertisement(
            result.getString("id"),
            result.getString("description"),
            result.getString("password"),
            LocalDateTime.parse(result.getString("advertisement_date")),
        )
    }

    private fun String.md5(): String {
        val md = MessageDigest.getInstance("MD5")
        val digest = md.digest(this.toByteArray())
        return digest.toString()
    }
}
