import { DataTypes, Model, Sequelize } from "sequelize";
import type { Optional } from "sequelize";
export interface LoginActivityAttributes {
  id: number;
  user_id: number;
  ip_address: string | null;
  user_agent: string | null;

  created_at: Date;
  updated_at: Date | null;
}

export interface LoginActivityCreationAttributes
  extends Optional<
    LoginActivityAttributes,
    "id" | "ip_address" | "user_agent" | "created_at" | "updated_at"
  > {}

export default class LoginActivity
  extends Model<LoginActivityAttributes, LoginActivityCreationAttributes>
{
  declare id: number;
  declare user_id: number;
  declare ip_address: string | null;
  declare user_agent: string | null;

  declare created_at: Date;
  declare updated_at: Date | null;
  static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        ip_address: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        user_agent: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "login_activities",
        timestamps: true,
        underscored: true,
      }
    );
  }
}
