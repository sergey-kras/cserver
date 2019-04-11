const UserSchema = require("../schemas/user");
const errors = require("../errors");
class authUser {
    constructor() {}

    async main(ctx, next) {
        this.ctx = ctx;
        this.next = next;
        return await this.conditions();
    }

    async conditions() {
        if (this.ctx.path !== '/auth') {
            let result = await this.checkUser();
            if (result) {
                return {
                    next: this.next(),
                    ctx: this.ctx
                };
            } else return {
                ctx: this.ctx,
            };
        } else {
            return {
                next: this.next(),
                ctx: this.ctx
            };
        }
    }

    async checkUser() {
        let status = await UserSchema.findOne({
            sid: this.ctx.cookies.get('sid')
        });
        this.ctx.state.user = status;
        return Boolean(status);
    }
}

module.exports = new authUser;