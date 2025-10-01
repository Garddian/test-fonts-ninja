import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { ArticleModel } from './adapters/persistence/sequelize/article.model';
import { ArticleSequelizeRepository } from './adapters/persistence/sequelize/article.sequelize.repository';

import { BrowserlessFetcher } from './adapters/fetchers/browserless.fetcher';
import { CheerioParser } from './adapters/parser/cheerio.parser';

import { ScraperController } from './adapters/http/scraper.controller';

import { ScrapeUrlUseCase } from './core/application/use-cases/scrape-url.usecase';
import { ListArticlesUseCase } from './core/application/use-cases/list-articles.usecase';
import * as process from "node:process";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        SequelizeModule.forRootAsync({
            useFactory: () => {
                const useSsl = String(process.env.DB_SSL).toLowerCase() === 'true';
                return {
                    dialect: 'mysql',
                    host: process.env.DB_HOST,
                    port: Number(process.env.DB_PORT),
                    database: process.env.DB_NAME,
                    username: process.env.DB_USER,
                    password: process.env.DB_PASS,
                    models: [ArticleModel],
                    autoLoadModels: true,
                    synchronize: true,
                    logging: false,
                    timezone: process.env.DB_TIMEZONE,
                    dialectOptions: useSsl ? { ssl: { rejectUnauthorized: true } } : {},
                    pool: { max: 10, min: 0, idle: 10000, acquire: 30000 },
                };
            }
        }),
        SequelizeModule.forFeature([ArticleModel]),
    ],
    controllers: [ScraperController],
    providers: [
        {
            provide: 'ARTICLE_REPOSITORY',
            useFactory: (model: typeof ArticleModel) => new ArticleSequelizeRepository(model),
            inject: [getModelToken(ArticleModel)],
        },
        { provide: 'HTML_FETCHER', useClass: BrowserlessFetcher },
        { provide: 'PARSER', useClass: CheerioParser },
        {
            provide: ScrapeUrlUseCase,
            useFactory: (fetcher, parser, repo) => new ScrapeUrlUseCase(fetcher, parser, repo),
            inject: ['HTML_FETCHER', 'PARSER', 'ARTICLE_REPOSITORY'],
        },
        {
            provide: ListArticlesUseCase,
            useFactory: (repo) => new ListArticlesUseCase(repo),
            inject: ['ARTICLE_REPOSITORY'],
        },
    ],
})
export class AppModule {}
