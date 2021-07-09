import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  ErrorType,
  Failure,
  get,
  post,
  Result,
  Success,
} from "../../src/api/api";
import { Tilgang } from "../../src/data/tilgang/tilgang";
import { expect } from "chai";

describe("Axios API tests", () => {
  let stub: MockAdapter;

  const tilgangDenied: Tilgang = { harTilgang: false, begrunnelse: "SYFO" };
  const tilgangDeniedMessage = { message: "Denied!" };
  const happyCaseMessage = "Woop woop";

  const pathAccessDenied = "/403tilgang";
  const pathAccessDeniedMessage = "/403message";
  const pathNotFound = "/404";
  const pathInternalServerError = "/500";
  const pathHappyCase = "/200";

  before(() => {
    stub = new MockAdapter(axios);
    stub.onGet(pathAccessDenied).replyOnce(403, tilgangDenied);
    stub.onPost(pathAccessDeniedMessage).replyOnce(403, tilgangDeniedMessage);
    stub.onPost(pathNotFound).replyOnce(404);
    stub.onGet(pathInternalServerError).replyOnce(500);
    stub.onGet(pathHappyCase).replyOnce(200, happyCaseMessage);
  });

  describe("Happy case", () => {
    it("returns expected data from http 200", async function () {
      const result: Result<any> = await get(pathHappyCase);
      expect(result instanceof Success).to.equal(true);

      const { data, code } = result as Success<any>;
      expect(code).to.equal(200);
      expect(data).to.equal(happyCaseMessage);
    });
  });

  describe("Access denied tests", () => {
    it("Returns access denied for http 403, and handles Tilgang-object", async function () {
      const result: Result<any> = await get(pathAccessDenied);
      expect(result instanceof Success).to.equal(false);
      expect(result.code).to.equal(403);

      const { error } = result as Failure;
      expect(error.type).to.equal(ErrorType.ACCESS_DENIED);
      expect(error.message).to.equal(tilgangDenied.begrunnelse);
    });

    it("Returns access denied for http 403, and handles message", async function () {
      const result: Result<any> = await post(pathAccessDeniedMessage, {
        some: "data",
      });
      expect(result instanceof Failure).to.equal(true);
      expect(result.code).to.equal(403);

      const { error } = result as Failure;
      expect(error.type).to.equal(ErrorType.ACCESS_DENIED);
      expect(error.message).to.equal(tilgangDeniedMessage.message);
    });
  });

  describe("General error tests", () => {
    it("Returns general error for http 404", async function () {
      const result: Result<any> = await post(pathNotFound, { some: "data" });
      expect(result instanceof Failure).to.equal(true);
      expect(result.code).to.equal(404);

      const { error } = result as Failure;
      expect(error.type).to.equal(ErrorType.GENERAL_ERROR);
    });

    it("Returns general error for http 500", async function () {
      const result: Result<any> = await get(pathInternalServerError);
      expect(result instanceof Failure).to.equal(true);
      expect(result.code).to.equal(500);

      const { error } = result as Failure;
      expect(error.type).to.equal(ErrorType.GENERAL_ERROR);
    });
  });
});
