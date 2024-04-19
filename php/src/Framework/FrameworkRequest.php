<?php
declare(strict_types=1);

namespace Demo\App\Framework;

final readonly class FrameworkRequest
{
    public const string METHOD_GET = 'GET';
    public const string METHOD_POST = 'POST';
    public const string METHOD_PUT = 'PUT';
    public const string METHOD_PATCH = 'PATCH';

    public function __construct(private string $method, private string $path, private array $content)
    {
    }

    public function method(): string
    {
        return $this->method;
    }

    public function path(): string
    {
        return $this->path;
    }

    public function pathStart(): string
    {
        return dirname($this->path());
    }

    public function getIdPath(): string
    {
        return basename(parse_url($this->path(), PHP_URL_PATH));
    }

    public function content(): array
    {
        return $this->content;
    }
}
