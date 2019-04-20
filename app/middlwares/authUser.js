const UserSchema = require("../schemas/user");
const errors = require("../errors");

async function authUser(ctx, next){
    if (ctx.path !== '/user/checkAuth') {
        let status = await UserSchema.findOne({
            sid: ctx.cookies.get('sid')
        });
        ctx.state.user = status;
        if (status) {
            await next();
        } else ctx.status = 500;
    } else {
        await next();
    }
}

module.exports = authUser;