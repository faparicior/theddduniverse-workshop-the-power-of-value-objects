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


class AdvertisementArgon2PasswordUpdateFeatureTest {
    companion object {
        private const val ADVERTISEMENT_CREATION_DATE = "2024-03-04T13:23:15"
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

    ////////////////////////////////////////////////////////////
    // Use this help
    // https://github.com/phxql/argon2-jvm

    @Test
    fun `should publish an advertisement with Argon2 password`() {

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
        var password = ""

        if (resultSet.next()) {
            password = resultSet.getString("password")
        }

        Assertions.assertTrue(password.startsWith("\$argon2i\$"))
    }

    @Test
    fun `should change to Argon2 password updating an advertisement`() {
        withAnAdvertisementWithMd5Password {
            val server = Server(DependencyInjectionResolver())

            val result = server.route(FrameworkRequest(
                    FrameworkRequest.METHOD_PUT,
                    "advertisement/${ID}",
                    mapOf(
                        "description" to NEW_DESCRIPTION,
                        "password" to PASSWORD,
                    )
                )
            )

            Assertions.assertEquals(FrameworkResponse.STATUS_OK, result.statusCode)

            val resultSet = this.connection.query("SELECT * from advertisements;")
            var password = ""

            if (resultSet.next()) {
                password = resultSet.getString("password")
            }

            Assertions.assertTrue(password.startsWith("\$argon2i\$"))
        }
    }

    @Test
    fun `should change to Argon2 password renewing an advertisement`() {
        withAnAdvertisementWithMd5Password {
            val server = Server(DependencyInjectionResolver())

            val result = server.route(FrameworkRequest(
                    FrameworkRequest.METHOD_PATCH,
                    "advertisement/${ID}",
                    mapOf(
                        "password" to PASSWORD,
                    )
                )
            )

            Assertions.assertEquals(FrameworkResponse.STATUS_OK, result.statusCode)

            val resultSet = this.connection.query("SELECT * from advertisements;")
            var password = ""

            if (resultSet.next()) {
                password = resultSet.getString("password")
            }

            Assertions.assertTrue(password.startsWith("\$argon2i\$"))
        }
    }

    private fun withAnAdvertisementWithMd5Password(block: () -> Unit) {
        this.connection.execute(
            """
            INSERT INTO advertisements (id, description, password, advertisement_date)
            VALUES ('$ID', '$DESCRIPTION', '${PASSWORD.md5()}', '$ADVERTISEMENT_CREATION_DATE');
            """.trimIndent()
        )

        block()
    }

    private fun String.md5(): String {
        val md = MessageDigest.getInstance("MD5")
        val digest = md.digest(this.toByteArray())
        val hexString = digest.joinToString("") { "%02x".format(it) }
        return hexString
    }
}
