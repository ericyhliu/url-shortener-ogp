import isURL from "validator/lib/isURL";

export const isValidUrl = (str: string) => isURL(str, { require_tld: true, require_protocol: false });
