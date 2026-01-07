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
    await queryInterface.createTable('email_verify_tokens',{
      id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
      },
      user_id:{
        type:Sequelize.INTEGER,
        references:{
          model:"users",
          key:"id"
        },
        allowNull:false,
        onDelete:"CASCADE",
        onUpdate:"CASCADE"
      },
      token:{
        type:Sequelize.TEXT,
        allowNull:false,        
      },
      expires_at:{
        type:Sequelize.DATE,
        allowNull:false,        
      },
      is_used:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:false
      },
      created_at:{
        type:Sequelize.DATE,
        allowNull:false,
        defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at:{
        type:Sequelize.DATE,
        allowNull:true
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
  }
};
