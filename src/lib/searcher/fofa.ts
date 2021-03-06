import { base64fy, buildURL } from "../url_builder";
import { Searcher, SearchableType } from "../types";

export class FOFA implements Searcher {
  public endpoint: string;
  public name: string;
  public supportedTypes: SearchableType[] = ["ip", "domain"];

  public constructor() {
    this.endpoint = "https://fofa.so";
    this.name = "FOFA";
  }

  public searchByIP(query: string): string {
    return this.search(`ip="${query}"`);
  }

  public searchByDomain(query: string): string {
    return this.search(`domain="${query}"`);
  }

  private search(query: string): string {
    return buildURL(this.endpoint, "/result", { qbase64: base64fy(query) });
  }
}
