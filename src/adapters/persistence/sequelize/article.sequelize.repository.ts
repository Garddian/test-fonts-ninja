import { ArticleRepositoryPort } from '../../../core/ports/article.repository.port';
import { Article } from '../../../core/domain/article.entity';
import {ArticleCreationAttributes, ArticleModel} from './article.model';

export class ArticleSequelizeRepository implements ArticleRepositoryPort {
    constructor(private readonly model: typeof ArticleModel) {}

    async save(article: ArticleCreationAttributes): Promise<Article> {
        const row = await this.model.create(article);
        return new Article(row.id, row.title, row.url, row.source, row.publicationDate ?? null);
    }

    async saveMany(articles: Article[]): Promise<Article[]> {
        const rows = await this.model.bulkCreate(
            articles.map(i => ({
                title: i.title,
                url: i.url,
                source: i.source,
                publicationDate: i.publicationDate,
            })),
            { validate: true }
        );
        return rows.map(r => new Article(r.id,r.title, r.url, r.source, r.publicationDate ?? null));
    }

    async list(limit = 50): Promise<Article[]> {
        const rows = await this.model.findAll({
            limit,
            order: [['publicationDate', 'DESC']],
        });
        return rows.map(r => new Article(r.id,r.title, r.url, r.source, r.publicationDate ?? null));
    }
}
