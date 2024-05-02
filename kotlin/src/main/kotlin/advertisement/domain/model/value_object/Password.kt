package advertisement.domain.model.value_object

import de.mkammerer.argon2.Argon2Factory
import java.security.MessageDigest

class Password private constructor(private val value: String) {

    companion object {
        fun fromPlainPassword(password: String): Password {
            val encryptedPassword = Argon2Factory.create().hash(1, 1024, 1, password.toCharArray())

            return Password(encryptedPassword)
        }

        fun fromEncryptedPassword(encryptedPassword: String): Password {
            return Password(encryptedPassword)
        }
    }

    fun value(): String {
        return value
    }

    fun isValidatedWith(password: String): Boolean {
        if (value.startsWith("\$argon2i\$")) {
            return Argon2Factory.create().verify(value, password.toCharArray())
        }

        return password.md5() == value
    }

    private fun String.md5(): String {
        val md = MessageDigest.getInstance("MD5")
        val digest = md.digest(this.toByteArray())
        val hexString = digest.joinToString("") { "%02x".format(it) }
        return hexString
    }
}
