<?php
declare(strict_types=1);

namespace Demo\App\Advertisement\Domain\ValueObject;


use Exception;

final readonly class Password
{
    private function __construct(private string $value)
    {
    }

    /**
     * @throws Exception
     */
    public static function fromPlainPassword(string $password): self
    {
        $result = password_hash($password, PASSWORD_ARGON2I);
        if(null === $result || false === $result) {
            throw new Exception("Problem hashing password");
        }
        return new Password($result);
    }

    public function value(): string
    {
        return $this->value;
    }

    public static function fromEncryptedPassword(string $password): self
    {
        return new Password($password);
    }

    public function isValidatedWith(string $password): bool
    {
        $hashSpecs = password_get_info($this->value);

        if(null === $hashSpecs['algo']) {
            return $this->value === md5($password);
        }

        return password_verify($password, $this->value);
    }
}
