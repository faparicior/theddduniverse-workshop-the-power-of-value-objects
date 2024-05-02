package e2e

import framework.DependencyInjectionResolver
import framework.FrameworkRequest
import framework.FrameworkResponse
import framework.Server
import framework.database.DatabaseConnection
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.security.MessageDigest
import java.time.LocalDateTime

class AdvertisementTest {
    companion object {
        private const val DESCRIPTION = "Dream advertisement"
        private const val NEW_DESCRIPTION = "Dream advertisement changed"
        private const val ID = "6fa00b21-2930-483e-b610-d6b0e5b19b29"
        private const val PASSWORD = "myPassword"
    }

    private lateinit var connection: DatabaseConnection

    @BeforeEach
    fun init() {
        this.connection = DependencyInjectionResolver().connection()
        this.connection.execute("DELETE FROM advertisements")
    }

    @Test
    fun `should publish an advertisement`() {

        val server = Server(DependencyInjectionResolver())

        val result = server.route(FrameworkRequest(
                FrameworkRequest.METHOD_POST,
                "advertisement",
                mapOf(
                    "id" to ID,
                    "description" to DESCRIPTION,
                    "password" to PASSWORD,
                )
            )
        )

        Assertions.assertEquals(FrameworkResponse.STATUS_CREATED, result.statusCode)

        val resultSet = this.connection.query("SELECT * from advertisements;")
        var description = ""

        if (resultSet.next()) {
            description = resultSet.getString(2)
        }

        Assertions.assertEquals(DESCRIPTION, description)
    }

    @Test
    fun `should update an advertisement`() {

        withAnAdvertisementCreated()

        val server = Server(DependencyInjectionResolver())

        val result = server.route(FrameworkRequest(
                FrameworkRequest.METHOD_PUT,
                "advertisement/$ID",
                mapOf(
                    "description" to NEW_DESCRIPTION,
                    "password" to PASSWORD,
                )
            )
        )

        Assertions.assertEquals(FrameworkResponse.STATUS_OK, result.statusCode)

        val resultSet = this.connection.query("SELECT * from advertisements;")
        var description = ""

        if (resultSet.next()) {
            description = resultSet.getString(2)
        }

        Assertions.assertEquals(NEW_DESCRIPTION, description)
        // todo review date
    }

    private fun withAnAdvertisementCreated()
    {
        val password = "myPassword".md5()
        val creationDate = LocalDateTime.parse("2024-03-04T13:23:15").toString()
        this.connection.execute("INSERT INTO advertisements (id, description, password, advertisement_date)" +
                " VALUES ('$ID', '$DESCRIPTION', '$password', '$creationDate')")
    }

    private fun String.md5(): String {
        val md = MessageDigest.getInstance("MD5")
        val digest = md.digest(this.toByteArray())
        return digest.toString()
    }
}
