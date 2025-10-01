import puppeteer, { Browser, Page } from 'puppeteer-core';
import { HtmlFetcherPort } from '../../core/ports/html-fetcher.port';

export class BrowserlessFetcher implements HtmlFetcherPort {
    async fetch(url: string): Promise<string> {
        const ws = process.env.BROWSERLESS_WS;
        if (!ws) throw new Error('BROWSERLESS_WS env var is required');

        const browser: Browser = await puppeteer.connect({
            browserWSEndpoint: ws,
            defaultViewport: { width: 1366, height: 768 },
        });

        let page: Page | null = null;
        try {
            page = await browser.newPage();
            if (process.env.USER_AGENT) {
                await page.setUserAgent(process.env.USER_AGENT);
            }

            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30_000 });
            await autoScroll(page);

            return await page.content();
        } finally {
            if (page) await page.close();
            await browser.disconnect(); // important: disconnect (pas close)
        }
    }
}

async function autoScroll(page: Page) {
    await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
            let total = 0;
            const step = 300;
            const timer = setInterval(() => {
                const max = document.body.scrollHeight - window.innerHeight;
                window.scrollBy(0, step);
                total += step;
                if (total >= max) {
                    clearInterval(timer);
                    resolve();
                }
            }, 150);
        });
    });
}
