import { Article } from '../domain/article.entity';
import {ArticleCreationAttributes} from "../../adapters/persistence/sequelize/article.model";

export interface ArticleRepositoryPort {
    save(article: ArticleCreationAttributes): Promise<Article>;
    saveMany(article: ArticleCreationAttributes[]): Promise<Article[]>;
    list(limit?: number): Promise<Article[]>;
}