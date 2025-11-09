export type RegisterPayload = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export type LoginPayload = {
  email: string;
  password: string;
}