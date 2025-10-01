import {
    Table, Column, Model, DataType,
    PrimaryKey, AutoIncrement, Index, CreatedAt
} from 'sequelize-typescript';
import {Optional} from "sequelize";
import {ArticleAttributes} from "../../../core/domain/article.entity";

export type ArticleCreationAttributes = Optional<ArticleAttributes, 'id'>;

@Table({ tableName: 'articles', timestamps: true, updatedAt: false })
export class ArticleModel extends Model<ArticleAttributes, ArticleCreationAttributes>
    implements ArticleAttributes{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column({ type: DataType.STRING(512), allowNull: false })
    title!: string;

    @Column({ type: DataType.STRING(1024), allowNull: false })
    url!: string;

    @Column({ type: DataType.STRING(512), allowNull: false })
    source!: string;

    @Index
    @Column({ type: DataType.DATE, allowNull: true})
    publicationDate!: Date | null;

    @CreatedAt
    @Column(DataType.DATE)
    createdAt?: Date;
}
