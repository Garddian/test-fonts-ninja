import { ArticleRepositoryPort } from '../../ports/article.repository.port';

export class ListArticlesUseCase {
    constructor(private readonly repo: ArticleRepositoryPort) {}

    execute(limit = 50) {
        return this.repo.list(limit);
    }
}