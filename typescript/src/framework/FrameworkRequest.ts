export enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH"
}
export class FrameworkRequest {
  readonly method: Method;
  readonly path: string;
  readonly param: any;
  readonly body: any;

  constructor(method: Method, fullPath: string, body: any
  ) {
    this.method = method;
    const [path, param] = this.splitPathAndId(fullPath)
    this.path = path
    this.param = param
    this.body = body
  }

  private splitPathAndId(input: string): [string, string] {
    const parts = input.split('/');

    const path = parts[1];
    const param = parts[2];

    return [path, param];
  }

}
