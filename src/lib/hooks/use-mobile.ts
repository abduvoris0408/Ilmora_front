import { MOBILE_BREAKPOINT } from "@/config/breakpoints";

import { useMediaQuery } from "./use-media-query";

/** shadcn sidebar shu hook'dan foydalanadi. md (768) dan kichik — mobil. */
export function useIsMobile() {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 0.02}px)`);
}
