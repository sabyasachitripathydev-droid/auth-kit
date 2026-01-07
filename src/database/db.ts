import { Sequelize } from "sequelize";

import User from "./models/users.js";
import EmailVerifyToken from "./models/email_verify_tokens.js";
import PasswordResetToken from "./models/password_reset_tokens.js";
import RefreshToken from "./models/refresh_tokens.js";
import LoginActivity from "./models/login_activities.js";
import { env } from "../cofig/env.js";
// MySQL connection (env variables)
const sequelize = new Sequelize(
  env.DB_DATABASE,
  env.DB_USERNAME,
  env.DB_PASSWORD,
  {
    host: env.DB_HOST,
    port:Number(env.DB_PORT),
    dialect: "mysql",
    logging: false,
  }
);

// Initialize models (no associations here)
User.initialize(sequelize);
EmailVerifyToken.initialize(sequelize);
PasswordResetToken.initialize(sequelize);
RefreshToken.initialize(sequelize);
LoginActivity.initialize(sequelize);

// =========================
// Define ALL Associations
// =========================

// User -> EmailVerifyToken
User.hasMany(EmailVerifyToken, {
  foreignKey: "user_id",
  as: "email_verify_tokens",
});
EmailVerifyToken.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// User -> PasswordResetToken
User.hasMany(PasswordResetToken, {
  foreignKey: "user_id",
  as: "password_reset_tokens",
});
PasswordResetToken.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// User -> RefreshToken
User.hasMany(RefreshToken, {
  foreignKey: "user_id",
  as: "refresh_tokens",
});
RefreshToken.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// User -> LoginActivity
User.hasMany(LoginActivity, {
  foreignKey: "user_id",
  as: "login_activities",
});
LoginActivity.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// Export sequelize instance and models
export {
  sequelize,
  User,
  EmailVerifyToken,
  PasswordResetToken,
  RefreshToken,
  LoginActivity,
};
