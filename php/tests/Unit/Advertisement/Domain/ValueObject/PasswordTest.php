<?php
declare(strict_types=1);

namespace Tests\Demo\App\Unit\Advertisement\Domain\ValueObject;

use Demo\App\Advertisement\Domain\Model\ValueObject\Password;
use PHPUnit\Framework\TestCase;
use ReflectionClass;

class PasswordTest extends TestCase
{
    private const string STRONG_ALGORITHM_PASSWORD = '$argon2i$v=19$m=65536,t=4,p=1$b0t4M3dsYTlzNXlEaFBJTQ$1qxVJUQMvov1pe8zDpB03bTRYARs08X8GPhEvHKXVAI';
    private const string MD5_ALGORITHM_PASSWORD = 'deb1536f480475f7d593219aa1afd74c';
    private const string PLAIN_PASSWORD = 'myPassword';

    public function test_should_not_be_instantiated_with_the_constructor(): void
    {
        $class = new ReflectionClass(Password::class);
        $constructor = $class->getConstructor();

        $this->assertTrue($constructor->isPrivate(), 'Constructor is not private');
    }

    public function test_should_be_created_with_a_strong_hash(): void
    {
        $password = Password::fromPlainPassword('plain-password');

        self::assertStringStartsWith('$argon2i$', $password->value());
    }

    public function test_should_not_change_passwords_with_strong_algorithm(): void
    {
        $password = Password::fromEncryptedPassword(self::STRONG_ALGORITHM_PASSWORD);

        self::assertEquals(self::STRONG_ALGORITHM_PASSWORD, $password->value());
    }

    public function test_should_validate_passwords_with_strong_algorithm(): void
    {
        $password = Password::fromEncryptedPassword(self::STRONG_ALGORITHM_PASSWORD);

        self::assertTrue($password->isValidatedWith(self::PLAIN_PASSWORD));
    }

    public function test_should_validate_passwords_with_weak_algorithm(): void
    {
        $password = Password::fromEncryptedPassword(self::MD5_ALGORITHM_PASSWORD);

        self::assertTrue($password->isValidatedWith(self::PLAIN_PASSWORD));
    }
}
