<?php
declare(strict_types=1);

namespace Demo\App\Advertisement\UI\Http;

use Demo\App\Advertisement\Application\Command\UpdateAdvertisement\UpdateAdvertisementCommand;
use Demo\App\Advertisement\Application\Command\UpdateAdvertisement\UpdateAdvertisementUseCase;
use Demo\App\Framework\FrameworkRequest;
use Demo\App\Framework\FrameworkResponse;

final class UpdateAdvertisementController
{
    public function __construct(private UpdateAdvertisementUseCase $useCase)
    {
    }

    public function request(FrameworkRequest $request): FrameworkResponse
    {
        $command = new UpdateAdvertisementCommand(
            $request->getIdPath(),
            ($request->content())['description'],
            ($request->content())['password'],
        );

        $this->useCase->execute($command);

        return new FrameworkResponse(
            FrameworkResponse::STATUS_OK,
            []
        );
    }
}
