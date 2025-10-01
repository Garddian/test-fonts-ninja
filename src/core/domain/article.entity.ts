export interface ArticleAttributes {
    id: number | null;
    title: string;
    url: string;
    source: string;
    publicationDate: Date | null;
}

export class Article implements ArticleAttributes {
    constructor(
        public readonly id: number | null,
        public readonly title: string,
        public readonly url: string,
        public readonly source: string,
        public readonly publicationDate: Date  | null,
    ) {
        if (!title?.trim()) throw new Error('Article.title required');
        if (!url?.trim()) throw new Error('Article.url required');
    }
}