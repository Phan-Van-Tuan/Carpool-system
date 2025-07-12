import { Payload } from "../types/token";

declare global {
  namespace Express {
    interface Request {
      user: Payload;
    }
  }
}
