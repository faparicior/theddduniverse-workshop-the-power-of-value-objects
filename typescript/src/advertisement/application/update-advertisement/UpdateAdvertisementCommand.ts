export class UpdateAdvertisementCommand {

  constructor(
    public readonly id: string,
    public readonly description: string,
    public readonly password: string
  ) {
  }

}
