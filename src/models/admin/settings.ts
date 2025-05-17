import {AutoIncrement, Column, Model, PrimaryKey, Table} from 'sequelize-typescript'
import {DataTypes} from "sequelize";

@Table({
  tableName: 'settings',
  paranoid: false,
  timestamps: false
})
class Settings extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  settings_id: number

  @Column(DataTypes.STRING)
  title_ru: string

  @Column(DataTypes.STRING)
  subtitle_ru: string

  @Column(DataTypes.STRING)
  title_en: string

  @Column(DataTypes.STRING)
  subtitle_en: string

  @Column(DataTypes.STRING)
  favicon: string
}

export default Settings
