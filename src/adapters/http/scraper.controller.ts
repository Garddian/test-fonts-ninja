import { Body, Controller, Get, Post } from '@nestjs/common';
import { RunScrapeRequest } from './dto/run-scrape.request';
import { ScrapeUrlUseCase } from '../../core/application/use-cases/scrape-url.usecase';
import { ListArticlesUseCase } from '../../core/application/use-cases/list-articles.usecase';
import { ScrapeUrlDto } from '../../core/application/dto/scrape-url.dto';

@Controller('scraper')
export class ScraperController {
    constructor(
        private readonly scrapeUrl: ScrapeUrlUseCase,
        private readonly listArticles: ListArticlesUseCase,
    ) {}

    @Post('run')
    async run(@Body() body: RunScrapeRequest) {
        return this.scrapeUrl.execute(new ScrapeUrlDto(body.url));
    }
    
    @Get('articles')
    async article() {
        return this.listArticles.execute(50);
    }
}
