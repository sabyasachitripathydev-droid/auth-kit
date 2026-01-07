import { DataTypes, Model, Sequelize } from "sequelize";
import type { Optional } from "sequelize";
export interface RefreshTokenAttributes {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
  revoked: boolean;

  created_at: Date;
  updated_at: Date | null;
}

export interface RefreshTokenCreationAttributes
  extends Optional<
    RefreshTokenAttributes,
    "id" | "revoked" | "created_at" | "updated_at"
  > {}

export default class RefreshToken
  extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
  implements RefreshTokenAttributes
{
  declare id: number;
  declare user_id: number;
  declare token: string;
  declare expires_at: Date;
  declare revoked: boolean;

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
          unique: true,
        },
        expires_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        revoked: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "refresh_tokens",
        timestamps: true,
        underscored: true,
      }
    );
  }
}
