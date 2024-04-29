<?php
declare(strict_types=1);

namespace Demo\App\Advertisement\Application\Command\PublishAdvertisement;

use Demo\App\Advertisement\Domain\AdvertisementRepository;
use Demo\App\Advertisement\Domain\Model\Advertisement;
use Demo\App\Advertisement\Domain\Model\ValueObject\Password;

final class PublishAdvertisementUseCase
{
    public function __construct(private AdvertisementRepository $advertisementRepository)
    {
    }

    public function execute(PublishAdvertisementCommand $command): void
    {
        $advertisement = new Advertisement(
            $command->id,
            $command->description,
            Password::fromPlainPassword($command->password),
            new \DateTime(),
        );

        $this->advertisementRepository->save($advertisement);
    }
}