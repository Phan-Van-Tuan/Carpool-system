import { Role } from "../../models/account.model";

export interface IToken {
  payload: Payload;
  iat: number;
  exp: number;
}

export interface Payload {
  id: any;
  role: Role;
  tokenId: string;
}
