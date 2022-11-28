import { guess_site_parser } from "./site_parsers.js";

export default class Search {
  constructor(url, search_terms, timestamp, metadata) {
    this.url = url;
    this.search_terms = search_terms;
    this.timestamp = timestamp;
    this.metadata = metadata;
  }

  static fromChromeEvent(tabId, changeInfo, tab) {
    const url = changeInfo.url;
    const site_parser = guess_site_parser(url);
    if (site_parser === undefined) return;
    return new this(url, site_parser.parse(), Math.floor(Date.now() / 1000), {
      chromeObjects: {
        tabId: tabId,
        changeInfo: changeInfo,
        tab: tab,
      },
    });
  }

  to_object() {
    return {
      url: this.url,
      search_terms: this.search_terms,
      timestamp: this.timestamp,
      metadata: this.metadata,
    };
  }
}
