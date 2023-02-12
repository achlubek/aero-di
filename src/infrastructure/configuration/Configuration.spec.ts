import { assert } from "chai";

import { Configuration } from "@app/infrastructure/configuration/Configuration";
import { availableLogLevels } from "@app/infrastructure/logger/LoggerInterface";

import sinon = require("sinon");

describe("Configuration", () => {
  it("Read log level", () => {
    const sandbox = sinon.createSandbox();
    for (const level of availableLogLevels) {
      sandbox.stub(process, "env").value({
        LOG_LEVEL: level,
      });
      const configuration = new Configuration();
      assert.equal(configuration.getLogLevel(), level);
    }
    sandbox.restore();
  });

  it("Throws with invalid log level", () => {
    const sandbox = sinon.createSandbox();
    sandbox.stub(process, "env").value({
      LOG_LEVEL: "invalid",
    });
    assert.throw(() => {
      new Configuration();
    }, `"LOG_LEVEL" env var is not a valid log level`);
    sandbox.restore();
  });

  it("Throws with missing log level", () => {
    const sandbox = sinon.createSandbox();
    sandbox.stub(process, "env").value({});
    assert.throw(() => {
      new Configuration();
    }, `LOG_LEVEL env var is missing`);
    sandbox.restore();
  });
});
