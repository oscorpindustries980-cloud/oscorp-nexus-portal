import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({ accessToken: z.string().min(10).max(4096) });

/**
 * Server-side confirmation of an MSG91 widget access token.
 * The private AuthKey lives in the MSG91_AUTHKEY secret and never reaches the browser.
 */
export const verifyOtpAccessToken = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const authkey = process.env["MSG91_AUTHKEY"];
    if (!authkey) {
      return { verified: false, message: "OTP verification is not configured on the server." };
    }

    const res = await fetch("https://control.msg91.com/api/v5/widget/verifyAccessToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authkey, "access-token": data.accessToken }),
    });

    const body = (await res.json().catch(() => null)) as
      | { type?: string; message?: unknown }
      | null;

    if (!res.ok || body?.type !== "success") {
      const message =
        typeof body?.message === "string" ? body.message : "Token verification failed.";
      return { verified: false, message };
    }

    return { verified: true, message: "Mobile/email verified with MSG91." };
  });
