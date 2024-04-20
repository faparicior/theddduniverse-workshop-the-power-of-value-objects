<?php
declare(strict_types=1);

namespace Demo\App\Advertisement\Application\Command\RenewAdvertisement;

use Demo\App\Advertisement\Domain\AdvertisementRepository;
use Exception;

final class RenewAdvertisementUseCase
{
    public function __construct(private AdvertisementRepository $advertisementRepository)
    {
    }

    /**
     * @throws Exception
     */
    public function execute(RenewAdvertisementCommand $command): void
    {
        $advertisement = $this->advertisementRepository->findById($command->id);

        if ($advertisement->password() !== md5($command->password)) {
            throw new Exception('Password incorrect');
        }

        $advertisement->renew();

        $this->advertisementRepository->save($advertisement);
    }
}
