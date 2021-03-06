import { buildURL } from "../url_builder";
import { Searcher, SearchableType } from "../types";

export class BinaryEdge implements Searcher {
  public endpoint: string;
  public name: string;
  public supportedTypes: SearchableType[] = ["ip", "domain"];

  public constructor() {
    this.endpoint = "https://app.binaryedge.io";
    this.name = "BinaryEdge";
  }

  public searchByIP(query: string): string {
    return buildURL(this.endpoint, "/services/query", {
      query: `ip:"${query}"`,
    });
  }

  public searchByDomain(query: string): string {
    return buildURL(this.endpoint, "/services/domains", { query });
  }
}
