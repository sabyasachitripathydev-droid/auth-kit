import { DataTypes, Model, Sequelize } from "sequelize";
import type { Optional } from "sequelize";
export interface EmailVerifyTokenAttributes {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
  is_used: boolean;

  created_at: Date;
  updated_at: Date | null;
}

export interface EmailVerifyTokenCreationAttributes
  extends Optional<
    EmailVerifyTokenAttributes,
    "id" | "is_used" | "created_at" | "updated_at"
  > {}

export default class EmailVerifyToken
  extends Model<EmailVerifyTokenAttributes, EmailVerifyTokenCreationAttributes>
{
  declare id: number;
  declare user_id: number;
  declare token: string;
  declare expires_at: Date;
  declare is_used: boolean;

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
        token: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        expires_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        is_used: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "email_verify_tokens",
        timestamps: true,
        underscored: true,
      }
    );
  }
}
