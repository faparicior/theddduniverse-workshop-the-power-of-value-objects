<?php
declare(strict_types=1);

namespace Demo\App\Advertisement\Domain\Model;

final class Advertisement
{
    public function __construct(
        private readonly string $id,
        private string $description,
        private string $password,
        private \DateTime $date
    ){
    }

    public function id(): string
    {
        return $this->id;
    }

    public function description(): string
    {
        return $this->description;
    }

    public function password(): string
    {
        return $this->password;
    }

    public function date(): \DateTime
    {
        return $this->date;
    }

    public function renew(): void
    {
        $this->updateDate();
    }

    public function update(string $description, string $password): void
    {
        $this->description = $description;
        $this->password = $password;
        $this->updateDate();
    }

    private function updateDate(): void
    {
        $this->date = new \DateTime();
    }
}
