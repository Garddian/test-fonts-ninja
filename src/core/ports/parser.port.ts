export type ParsedNode = { title: string; url?: string; publicationDate?: Date };

export interface ParserPort {
    parse(html: string, baseUrl?: string): ParsedNode[];
}