export function guess_site_parser(from_url) {
  const _url = new URL(from_url);
  switch (true) {
    case /google\.com$/.test(_url.hostname):
      return new GenericGetParser(_url);
    default:
      break;
  }
}

export class GenericGetParser {
  constructor(url, parameter = "q") {
    this.url = url;
    this.parameter = parameter;
  }

  parse() {
    return new URL(this.url).searchParams.get(this.parameter);
  }
}
