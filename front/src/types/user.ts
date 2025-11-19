export type Role = "USER" | "ADMIN"

export type User = {
  id: string
  firstname: string
  lastname: string
  email: string
  password: string
  role: Role
  created_at: string
}

export type UserRolePayload = {
  role: Role
}