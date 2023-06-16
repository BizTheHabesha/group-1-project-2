const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/connection");

class User extends Model {
	/**
	 * Check stored hash vs hash passed in. Return equivelence.
	 * @param {String} pw bcrypt-hashed string
	 * @returns {Boolean}
	 */
	C_PW_UH(pw) {
		return bcrypt.compareSync(pw, this.password);
	}
}

User.init(
	{
		// unique user id for every user that auto increments to ensure unique ids
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		// unique emails for each user, validated for actual emails
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		// a password for this user validated to be at least 8 characters, contain a letter, number, and special character
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		// a phone number for user to be able to receive text messages personalized to their account
		phone: {
			type: DataTypes.STRING,
			validate: {
				is: /^(\+0?1\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/i,
			},
			allowNull: false,
		},
		favoriteTeam: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				isNumeric: true,
			},
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
		},
	},
	{
		// hooks for the User model
		hooks: {
			// before a user is created: hash their password
			beforeCreate: async (newUserData) => {
				newUserData.password = await bcrypt.hash(
					newUserData.password,
					12
				);
				return newUserData;
			},
		},
		// sequelize for the model
		sequelize,
		// timestamps not nescceary
		timestamps: false,
		// ensure the table name matches the model name
		freezeTableName: true,
		// underscore for spaces (n/a)
		underscored: true,
		// model name for external references
		modelName: "user",
	}
);

module.exports = User;
