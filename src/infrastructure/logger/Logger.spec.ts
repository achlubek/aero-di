import { assert } from "chai";

import { Logger } from "@app/infrastructure/logger/Logger";
import { availableLogLevels } from "@app/infrastructure/logger/LoggerInterface";

import sinon = require("sinon");

describe("Logger", () => {
  for (const setLogLevel of availableLogLevels) {
    describe(`Respect ${setLogLevel} log level`, () => {
      const effectiveLogLevels = Logger.getEffectiveLogLevels(setLogLevel);
      const sandbox = sinon.createSandbox();
      const stub = sandbox.stub(console, "log");
      const logger = new Logger(setLogLevel);
      if (effectiveLogLevels.includes("debug")) {
        assert.isTrue(stub.calledOnce);
      } else {
        assert.isFalse(stub.called);
      }
      sandbox.restore();
      for (const messageLogLevel of availableLogLevels.filter(
        (l) => l !== "none"
      )) {
        it(`Respects message with log level ${messageLogLevel}`, () => {
          const sandbox = sinon.createSandbox();
          const stub = sandbox.stub(console, "log");
          assert.isDefined(
            logger[messageLogLevel],
            `Function for log level ${messageLogLevel} is not defined`
          );
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          logger[messageLogLevel]("source", "message");
          if (effectiveLogLevels.includes(messageLogLevel)) {
            assert.isTrue(stub.calledOnce);
          } else {
            assert.isFalse(stub.called);
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          logger.log(messageLogLevel, "source", "message");
          if (effectiveLogLevels.includes(messageLogLevel)) {
            assert.isTrue(stub.calledTwice);
          } else {
            assert.isFalse(stub.called);
          }

          sandbox.restore();
        });
      }
    });
  }

  it("Return empty effective log levels if invalid log levels is passed", () => {
    assert.throw(() => new Logger("test"), "Invalid log level test");
  });
});
