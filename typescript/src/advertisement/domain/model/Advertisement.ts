export class Advertisement {

  constructor(
    private readonly _id: string,
    private _description: string,
    private _password: string,
    private _date: Date
  ) {
  }

  public update(description: string, password: string): void {
    this._description = description;
    this._password = password;
    this.updateDate();
  }

  public renew(): void {
    this.updateDate();
  }

  public id(): string {
    return this._id
  }

  public description(): string {
    return this._description
  }

  public password(): string {
    return this._password
  }

  public date(): Date {
    return this._date
  }

  private updateDate(): void {
    this._date = new Date();
  }
}
