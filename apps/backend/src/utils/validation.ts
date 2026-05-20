import { status } from "elysia";

export function same(string1: string, string2: string) {
  if (string1 !== string2) {
    return status(400, {
      ok: false,
      message: "Passwords do not match",
    });
  }
}
