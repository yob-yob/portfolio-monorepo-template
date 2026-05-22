import { Elysia } from "elysia";
import { UploadModel } from "./model.ts";
import { UploadController } from "./service.ts";

export const upload = new Elysia().post(
  "/upload",
  async ({ body }) => UploadController.handleUploadRequest(body),
  {
    body: UploadModel.UploadBody,
    response: {
      201: UploadModel.UploadSuccessReponse,
    },
  }
);
