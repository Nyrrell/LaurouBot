import { Model, DataTypes } from "sequelize";

export class Youtube extends Model {
  static config(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.TEXT,
          unique: true,
          allowNull: false,
          primaryKey: true,
        },
        channel: DataTypes.TEXT,
        title: DataTypes.TEXT,
        descr: DataTypes.TEXT,
        thumb: DataTypes.TEXT,
        channelId: DataTypes.TEXT,
      },
      {
        sequelize,
      }
    );
  }
}
