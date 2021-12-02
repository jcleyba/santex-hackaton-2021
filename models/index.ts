import {
  Table,
  Column,
  Model,
  HasMany,
  ForeignKey,
  BelongsToMany,
  PrimaryKey,
} from 'sequelize-typescript'

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
  @PrimaryKey
  @Column
  name!: string
  @BelongsToMany(() => SME, () => SmeTag)
  smes!: SME[]
}

@Table
class SmeTag extends Model {
  @ForeignKey(() => SME)
  @Column
  userId!: string

  @ForeignKey(() => Tag)
  @Column
  name!: string
}

export { SME, Tag, SmeTag }
