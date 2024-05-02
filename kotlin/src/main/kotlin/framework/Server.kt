package framework

class Server(private val resolver: DependencyInjectionResolver){
    fun route(request: FrameworkRequest): FrameworkResponse {
        return when (request.method) {
            FrameworkRequest.METHOD_GET -> {
                this.get()
            }
            FrameworkRequest.METHOD_POST -> {
                this.post(request)
            }
            FrameworkRequest.METHOD_PUT -> {
                this.put(request)
            }
            FrameworkRequest.METHOD_PATCH -> {
                this.patch(request)
            }
            else -> {
               return this.notFound()
            }
        }
    }

    private fun get(): FrameworkResponse {
        return FrameworkResponse(FrameworkResponse.STATUS_NOT_FOUND, mapOf())
    }

    private fun post(request: FrameworkRequest): FrameworkResponse {
        return when (request.path) {
            "advertisement" -> {
                resolver.publishAdvertisementController().execute(request)
            }
            else -> {
                this.notFound()
            }
        }
    }

    private fun put(request: FrameworkRequest): FrameworkResponse {
        return when (request.pathStart()) {
            "advertisement" -> {
                resolver.updateAdvertisementController().execute(request)
            }
            else -> {
                this.notFound()
            }
        }
    }

    private fun patch(request: FrameworkRequest): FrameworkResponse {
        return when (request.pathStart()) {
            "advertisement" -> {
                resolver.renewAdvertisementController().execute(request)
            }
            else -> {
                this.notFound()
            }
        }
    }

    private fun notFound(): FrameworkResponse {
        return FrameworkResponse(FrameworkResponse.STATUS_NOT_FOUND, mapOf())
    }
}
