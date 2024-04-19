<?php
declare(strict_types=1);

namespace Demo\App\Advertisement\UI\Http;

use Demo\App\Advertisement\Application\Command\RenewAdvertisement\RenewAdvertisementCommand;
use Demo\App\Advertisement\Application\Command\RenewAdvertisement\RenewAdvertisementUseCase;
use Demo\App\Framework\FrameworkRequest;
use Demo\App\Framework\FrameworkResponse;

final class RenewAdvertisementController
{
    public function __construct(private RenewAdvertisementUseCase $useCase)
    {
    }

    public function request(FrameworkRequest $request): FrameworkResponse
    {
        $command = new RenewAdvertisementCommand(
            $request->getIdPath(),
            ($request->content())['password'],
        );

        $this->useCase->execute($command);

        return new FrameworkResponse(
            FrameworkResponse::STATUS_OK,
            []
        );
    }
}
