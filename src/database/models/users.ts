import { DataTypes, Model, Sequelize } from "sequelize";
import type { Optional } from "sequelize";
export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  is_verified: boolean;
  role: string;

  created_at: Date;
  updated_at: Date;
}

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    "id" | "is_verified" | "created_at" | "updated_at"
  > {}

export default class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare name: string;
  declare email: string;
  declare password_hash: string;
  declare is_verified: boolean;
  declare role: string;

  declare created_at: Date;
  declare updated_at: Date;

  static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(150),
          allowNull: false,
          unique: true,
        },
        password_hash: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        is_verified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        role: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "users",
        timestamps: true,
        underscored: true,
      }
    );
  }
}
