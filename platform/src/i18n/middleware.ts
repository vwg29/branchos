import createMiddleware from "next-intl/middleware";
import { routing } from "./routing";

// The next-intl locale middleware, composed inside src/middleware.ts.
export const intlMiddleware = createMiddleware(routing);
