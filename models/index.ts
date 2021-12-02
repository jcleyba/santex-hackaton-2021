import { Table, Column, Model, HasMany, ForeignKey, BelongsToMany } from 'sequelize-typescript';

@Table
class SME extends Model {
  @Column
  email!: string

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
  smeId!: number

  @ForeignKey(() => Tag)
  @Column
  tagId!: number
}


export { SME, Tag, SmeTag };