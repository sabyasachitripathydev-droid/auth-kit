'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('users',{
      id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
      },
      name:{
        type:Sequelize.STRING(150),
        allowNull:false,        
      },
      email:{
        type:Sequelize.STRING(150),
        allowNull:false,
        unique:true        
      },
      password_hash:{
        type:Sequelize.TEXT,
        allowNull:false,        
      },
      is_verified:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:false        
      },
      role:{
        type:Sequelize.STRING(30),
        allowNull:false,             
      },
      created_at:{
        type:Sequelize.DATE,
        allowNull:false,
        defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')       
      },
      updated_at:{
        type:Sequelize.STRING(150),
        allowNull:false,
        defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')        
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('users');
  }
};
