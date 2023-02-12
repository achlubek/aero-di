import { assert } from "chai";

import {
  loadOptionalBoolean,
  loadOptionalInt,
  loadOptionalString,
  loadRequiredBoolean,
  loadRequiredInt,
  loadRequiredString,
} from "@app/infrastructure/configuration/envLoadingUtils";

import sinon = require("sinon");

describe("envLoadingUtils", () => {
  describe("Strings", () => {
    it("Read required string", () => {
      const sandbox = sinon.createSandbox();
      sandbox.stub(process, "env").value({
        ENV_NAME: "value",
      });
      const result = loadRequiredString("ENV_NAME");
      assert.equal(result, "value");
      sandbox.restore();
    });

    it("Read optional existing string", () => {
      const sandbox = sinon.createSandbox();
      sandbox.stub(process, "env").value({
        ENV_NAME: "value",
      });
      const result = loadOptionalString("ENV_NAME", "default");
      assert.equal(result, "value");
      sandbox.restore();
    });

    it("Read optional non-existing string", () => {
      const sandbox = sinon.createSandbox();
      sandbox.stub(process, "env").value({});
      const result = loadOptionalString("ENV_NAME", "default");
      assert.equal(result, "default");
      sandbox.restore();
    });

    it("Throws with missing required string", () => {
      const sandbox = sinon.createSandbox();
      sandbox.stub(process, "env").value({});
      assert.throw(() => {
        loadRequiredString("ENV_NAME");
      }, `ENV_NAME env var is missing`);
      sandbox.restore();
    });
  });

  describe("Ints", () => {
    it("Read required int", () => {
      const sandbox = sinon.createSandbox();
      sandbox.stub(process, "env").value({
        ENV_NAME: "123",
      });
      const result = loadRequiredInt("ENV_NAME");
      assert.equal(result, 123);
      sandbox.restore();
    });

    it("Read optional existing int", () => {
      const sandbox = sinon.createSandbox();
      sandbox.stub(process, "env").value({
        ENV_NAME: "123",
      });
      const result = loadOptionalInt("ENV_NAME", 404);
      assert.equal(result, 123);
      sandbox.restore();
    });

    it("Read optional non-existing int", () => {
      const sandbox = sinon.createSandbox();
      sandbox.stub(process, "env").value({});
      const result = loadOptionalInt("ENV_NAME", 404);
      assert.equal(result, 404);
      sandbox.restore();
    });

    it("Throws with invalid required int", () => {
      const sandbox = sinon.createSandbox();
      sandbox.stub(process, "env").value({
        ENV_NAME: "abc",
      });
      assert.throw(() => {
        loadRequiredInt("ENV_NAME");
      }, `ENV_NAME env var is not a valid integer`);
      sandbox.restore();
    });

    it("Throws with invalid required int", () => {
      const sandbox = sinon.createSandbox();
      sandbox.stub(process, "env").value({
        ENV_NAME: "abc",
      });
      assert.throw(() => {
        loadOptionalInt("ENV_NAME", 404);
      }, `ENV_NAME env var is not a valid integer`);
      sandbox.restore();
    });

    it("Throws with missing required int", () => {
      const sandbox = sinon.createSandbox();
      sandbox.stub(process, "env").value({});
      assert.throw(() => {
        loadRequiredInt("ENV_NAME");
      }, `ENV_NAME env var is missing`);
      sandbox.restore();
    });
  });

  describe("Booleans", () => {
    it("Read required true boolean", () => {
      const sandbox = sinon.createSandbox();
      sandbox.stub(process, "env").value({
        ENV_NAME: "true",
      });
      const result = loadRequiredBoolean("ENV_NAME");
      assert.equal(result, true);
      sandbox.restore();
    });

    it("Read required false boolean", () => {
      const sandbox = sinon.createSandbox();
      sandbox.stub(process, "env").value({
        ENV_NAME: "false",
      });
      const result = loadRequiredBoolean("ENV_NAME");
      assert.equal(result, false);
      sandbox.restore();
    });

    it("Read optional existing true boolean", () => {
      const sandbox = sinon.createSandbox();
      sandbox.stub(process, "env").value({
        ENV_NAME: "true",
      });
      const result = loadOptionalBoolean("ENV_NAME", false);
      assert.equal(result, true);
      sandbox.restore();
    });

    it("Read optional existing false boolean", () => {
      const sandbox = sinon.createSandbox();
      sandbox.stub(process, "env").value({
        ENV_NAME: "false",
      });
      const result = loadOptionalBoolean("ENV_NAME", true);
      assert.equal(result, false);
      sandbox.restore();
    });

    it("Read optional non-existing true boolean", () => {
      const sandbox = sinon.createSandbox();
      sandbox.stub(process, "env").value({});
      const result = loadOptionalBoolean("ENV_NAME", true);
      assert.equal(result, true);
      sandbox.restore();
    });

    it("Read optional non-existing false boolean", () => {
      const sandbox = sinon.createSandbox();
      sandbox.stub(process, "env").value({});
      const result = loadOptionalBoolean("ENV_NAME", false);
      assert.equal(result, false);
      sandbox.restore();
    });

    it("Throws with missing required boolean", () => {
      const sandbox = sinon.createSandbox();
      sandbox.stub(process, "env").value({});
      assert.throw(() => {
        loadRequiredBoolean("ENV_NAME");
      }, `ENV_NAME env var is missing`);
      sandbox.restore();
    });
  });
});
