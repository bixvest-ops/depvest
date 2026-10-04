import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { extractTerms } from "./terms-extract.server";

export const extractProductTerms = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ document: z.string().trim().min(40).max(60000) }).parse(data))
  .handler(async ({ data }) => {
    try {
      return { ok: true as const, terms: await extractTerms(data.document) };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Extraction failed" };
    }
  });
