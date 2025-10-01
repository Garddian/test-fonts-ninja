import { HtmlFetcherPort } from '../../ports/html-fetcher.port';
import { ParserPort } from '../../ports/parser.port';
import { ArticleRepositoryPort } from '../../ports/article.repository.port';
import { Article } from '../../domain/article.entity';
import { ScrapeUrlDto } from '../dto/scrape-url.dto';

export class ScrapeUrlUseCase {
    constructor(
        private readonly fetcher: HtmlFetcherPort,
        private readonly parser: ParserPort,
        private readonly repo: ArticleRepositoryPort,
    ) {}

    async execute(dto: ScrapeUrlDto) {
        const html = await this.fetcher.fetch(dto.url);
        const nodes = this.parser.parse(html, dto.url);
        const source = 'BBC';
        const publicationDate = new Date();

        const articles = nodes.map(n => new Article(
            null,
            n.title,
            new URL(n.url ?? dto.url, dto.url).toString(),
            source,
            publicationDate
        ));

        return this.repo.saveMany(articles);
    }
}
