import { DataTypes, Sequelize } from "sequelize";

export class SQLiteBaseDatasource {
  path: string;
  constructor(path: string) {
    this.path = path;
  }

  getDb() {
    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: this.path
    });
    return sequelize;
  }

  getSettingsModel(sequelize: Sequelize) {
    const Setting = sequelize.define(
      'settings',
      {
        name: {
          type: DataTypes.TEXT,
          allowNull: false,
          primaryKey: true
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        type: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        value: {
          type: DataTypes.TEXT,
          allowNull: true
        }
      },
      {
        timestamps: false,
      }
    );
    Setting.removeAttribute('id');
    return Setting;
  }
}