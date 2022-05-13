import { spawn } from "child_process";
import path from "path";
import { fetch } from "undici";
import type { ChildProcess } from "child_process";
import type { Response } from "undici";

const isWindows = process.platform === "win32";
let wranglerProcess: ChildProcess;

const waitUntilReady = async (url: string): Promise<Response> => {
  let response: Response | undefined = undefined;

  while (response === undefined) {
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 500));

    try {
      response = await fetch(url);
    } catch {}
  }

  return response as Response;
};

describe("Pages Dev", () => {
  beforeEach(async () => {
    wranglerProcess = spawn("npm", ["run", "dev"], {
      shell: isWindows,
      cwd: path.resolve(__dirname, "../"),
      env: { BROWSER: "none", ...process.env },
      detached: true,
    });
  });

  afterEach(async () => {
    await new Promise((resolve, reject) => {
      wranglerProcess.once("exit", (code) => {
        if (!code) {
          resolve(code);
        } else {
          reject(code);
        }
      });
      wranglerProcess.unref();
      wranglerProcess.kill("SIGTERM");
    });
  });

  it("should work with `--node-compat` when running code requiring polyfills", async () => {
    const response = await waitUntilReady("http://localhost:8789/stripe");

    await expect(response.text()).resolves.toMatchInlineSnapshot(
      `"path/to/some-file"`
    );
  });
});
