import {Password} from "./value-object/Password";

export class Advertisement {

  constructor(
    private readonly _id: string,
    private _description: string,
    private _password: Password,
    private _date: Date
  ) {
  }

  public update(description: string, password: Password): void {
    this._description = description;
    this._password = password;
    this.updateDate();
  }

  public renew(password: Password): void {
    this._password = password;
    this.updateDate();
  }

  public id(): string {
    return this._id
  }

  public description(): string {
    return this._description
  }

  public password(): Password {
    return this._password
  }

  public date(): Date {
    return this._date
  }

  private updateDate(): void {
    this._date = new Date();
  }
}
