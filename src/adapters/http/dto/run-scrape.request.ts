import { IsUrl } from 'class-validator';

export class RunScrapeRequest {
    @IsUrl()
    url!: string;
}
