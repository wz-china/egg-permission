
const { app, mock, assert } = require('egg-mock/bootstrap');

describe("测试用户登录业务处理", () => {
  it('用户登录', async () => {
    // 创建 ctx
    const ctx = app.mockContext();
    // 通过 ctx 访问到 service.user
    const user = await ctx.service.user.loginIn({username:"asdasd",password:"1"});
    assert(user.code == 0);
  });
});



