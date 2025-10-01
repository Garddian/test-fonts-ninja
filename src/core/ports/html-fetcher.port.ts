export interface HtmlFetcherPort {
    fetch(url: string): Promise<string>;
}