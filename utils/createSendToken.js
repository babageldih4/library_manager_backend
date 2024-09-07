const jwt = require('jsonwebtoken');

const signToken = (id) => {
    return jwt.sign({ id }, 'rustam', {});
};

exports.createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);
    user.password = undefined;

    res.status(statusCode).json({
        token,
        data: {
            user,
        },
    });
};
exports.createSendTokenSeller = (seller, statusCode, res) => {
    const token = signToken(seller.id);
    seller.password = undefined;

    res.status(statusCode).json({
        token,
        data: {
            seller,
        },
    });
};