import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export default getRequestConfig(async () => {
  // Get locale from cookies or headers, default to "en"
  const cookieStore = await cookies();
  const headersList = await headers();

  let locale =
    cookieStore.get("locale")?.value ||
    headersList.get("accept-language")?.split(",")[0]?.split("-")[0] ||
    "en";

  // Ensure locale is supported
  if (!["en", "fr"].includes(locale)) {
    locale = "en";
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
