import { Table, Column, Model, HasMany, ForeignKey, BelongsToMany, PrimaryKey } from 'sequelize-typescript';

@Table
class SME extends Model {
  @PrimaryKey
  @Column
  userId!: string

  @BelongsToMany(() => Tag, () => SmeTag)
  tags!: Tag[]
}

@Table
class Tag extends Model {
  @Column
  name!: string
  @BelongsToMany(() => SME, () => SmeTag)
  smes!: SME[];
}

@Table
class SmeTag extends Model {
  @ForeignKey(() => SME)
  @Column
  smeId!: string

  @ForeignKey(() => Tag)
  @Column
  tagId!: number
}


export { SME, Tag, SmeTag };