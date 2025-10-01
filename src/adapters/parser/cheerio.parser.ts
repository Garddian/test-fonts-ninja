import * as cheerio from 'cheerio';
import { ParserPort, ParsedNode } from '../../core/ports/parser.port';

export class CheerioParser implements ParserPort {
    parse(html: string, baseUrl?: string): ParsedNode[] {
        const $ = cheerio.load(html);
        const results: ParsedNode[] = [];

        $('div[data-testid="dundee-card"]').each((_, el) => {
            const title =
                $(el).find('h2').first().text().trim() ||
                $(el).attr('data-title');

            const href = $(el).find('a').first().attr('href') ?? undefined;
            const publicationHours = $(el).find('div[data-testid="card-metadata-lastupdated"]').first().text().trim().match(/^[0-9]+/) || '';
            const publicationDate = new Date();
            if (typeof publicationHours === "string") {
                publicationDate.setHours(publicationDate.getHours() - parseInt(publicationHours));
            }
            if (title) {
                results.push({
                    title,
                    url: href ? this.resolveUrl(baseUrl, href) : baseUrl,
                    publicationDate,
                });
            }
        });

        return results;
    }

    private resolveUrl(baseUrl: string | undefined, href: string): string | undefined {
        if (!baseUrl) return href;
        try {
            return new URL(href, baseUrl).toString();
        } catch {
            return href;
        }
    }
}
