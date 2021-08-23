export const BASE_URL: Readonly<string> = import.meta.env.DEV ? "api-gbf-raid-finder.amlispiration.com" :"API_HOST_NAME"

export const HTTP_PROTOCOL: Readonly<string> = "https://"

export const WS_PROTOCOL: Readonly<string> = "wss://"

export const WS_PATH: Readonly<string> = "stream_bosses"
