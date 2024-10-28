import { User } from "./types";

export interface UserReducerInitialState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}
