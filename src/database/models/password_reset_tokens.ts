import { DataTypes, Model, Sequelize } from "sequelize";
import type { Optional } from "sequelize";

export interface PasswordResetTokenAttributes {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
  used: boolean;

  created_at: Date;
  updated_at: Date | null;
}

export interface PasswordResetTokenCreationAttributes
  extends Optional<
    PasswordResetTokenAttributes,
    "id" | "used" | "created_at" | "updated_at"
  > {}

export default class PasswordResetToken
  extends Model<
    PasswordResetTokenAttributes,
    PasswordResetTokenCreationAttributes
  >
{
  declare id: number;
  declare user_id: number;
  declare token: string;
  declare expires_at: Date;
  declare used: boolean;

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
        used: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "password_reset_tokens",
        timestamps: true,
        underscored: true,
      }
    );
  }
}
