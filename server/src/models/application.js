module.exports = (sequelize, DataTypes) => {
    const Application = sequelize.define('Application', {
        applicant: { type: DataTypes.STRING, allowNull: false },
        courtName: { type: DataTypes.STRING, allowNull: false },
        location: { type: DataTypes.STRING, allowNull: false },
        date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
        status: { type: DataTypes.STRING, defaultValue: 'Pending' }, // Pending, Approved, Rejected
        document: { type: DataTypes.STRING, allowNull: true },
        description: { type: DataTypes.TEXT, allowNull: true },
        reason: { type: DataTypes.STRING, allowNull: true } // Alasan penolakan
    }, {
        tableName: 'applications'
    });
    return Application;
};
