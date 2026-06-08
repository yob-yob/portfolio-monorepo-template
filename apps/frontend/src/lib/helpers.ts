export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/---/g, "-"); // handle cases where the result has 3 dashes (-) example "Wilkinson - Dare" becomes "Wilkinson---Dare"
}

/**
 * We should only pass down the COOKIE and AUTHORIZATION HEADERS. this is the only thing better-auth needs
 *
 * The key thing being stripped out is host —
 * that's the header Traefik was reading to misroute your SSR auth call back to the frontend.
 * By explicitly constructing a new headers object with only the two auth-relevant headers,
 * host never gets forwarded and Traefik routes the backend call correctly based on the URL's domain (api.city-os.demo.yob-yob.com),
 * not the incoming request's host.
 */
export function getHeadersCookieAndAuthorizationValues(headers: Headers) {
  return {
    cookie: headers.get("cookie") ?? "",
    authorization: headers.get("authorization") ?? "",
  };
}
