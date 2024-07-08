package advertisement.infrastructure

import de.mkammerer.argon2.Argon2Factory
import java.security.MessageDigest

class PasswordHasher {

    fun create(plainPassword: String): String {
        return Argon2Factory.create().hash(1, 1024, 1, plainPassword.toCharArray())
    }

    fun verify(hash: String, password: String): Boolean {
        if (hash.startsWith("\$argon2i\$")) {
            return Argon2Factory.create().verify(hash, password.toCharArray())
        }

        return password.md5() == hash
    }
}

private fun String.md5(): String {
    val md = MessageDigest.getInstance("MD5")
    val digest = md.digest(this.toByteArray())
    val hexString = digest.joinToString("") { "%02x".format(it) }
    return hexString
}
