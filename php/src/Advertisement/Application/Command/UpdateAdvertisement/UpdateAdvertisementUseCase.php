<?php
declare(strict_types=1);

namespace Demo\App\Advertisement\Application\Command\UpdateAdvertisement;

use Demo\App\Advertisement\Domain\AdvertisementRepository;
use Exception;

final class UpdateAdvertisementUseCase
{
    public function __construct(private AdvertisementRepository $advertisementRepository)
    {
    }

    /**
     * @throws Exception
     */
    public function execute(UpdateAdvertisementCommand $command): void
    {
        $advertisement = $this->advertisementRepository->findById($command->id);

        if ($advertisement->password() !== md5($command->password)) {
            throw new Exception('Password incorrect');
        }

        $advertisement->update($command->description, $command->password);

        $this->advertisementRepository->save($advertisement);
    }
}
