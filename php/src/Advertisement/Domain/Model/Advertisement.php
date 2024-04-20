<?php
declare(strict_types=1);

namespace Demo\App\Advertisement\Domain\Model;

use Demo\App\Advertisement\Domain\ValueObject\Password;

final class Advertisement
{
    public function __construct(
        private readonly string $id,
        private string $description,
        private Password $password,
        private \DateTime $date
    ){
    }

    public function renew(Password $password): void
    {
        $this->password = $password;
        $this->updateDate();
    }

    public function update(string $description, Password $password): void
    {
        $this->description = $description;
        $this->password = $password;
        $this->updateDate();
    }

    public function id(): string
    {
        return $this->id;
    }

    public function description(): string
    {
        return $this->description;
    }

    public function password(): Password
    {
        return $this->password;
    }

    public function date(): \DateTime
    {
        return $this->date;
    }

    private function updateDate(): void
    {
        $this->date = new \DateTime();
    }
}
