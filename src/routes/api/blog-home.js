/**
 * @description 首页 API 路由
 * @author XI
 */

const router = require('koa-router')()
const { loginCheck } = require('../../middlewares/loginChecks')
const { create } = require('../../controller/blog-home')
const { genValidator } = require('../../middlewares/validator')
const blogValidate = require('../../validator/blog')
const {getHomeBlogList} = require ('../../controller/blog-home')
const {getBlogListStr} = require('../../utils/blog')


router.prefix('/api/blog')

// 创建微博
router.post('/create', loginCheck, genValidator(blogValidate), async (ctx, next) => {
    const { content, image } = ctx.request.body
    const { id: userId } = ctx.session.userInfo
    ctx.body = await create({ userId, content, image })
})

router.get('./loadmore/:pageIndex',loginCheck,async(ctx,next) => {
    let {pageIndex} = ctx.params
    pageIndex = parseInt(pageIndex)
    const {id:userId} =ctx.session.userInfo

    const result = await getHomeBlogList(userId,pageIndex)
    result.data.blogListTpl = getBlogListStr(result.data.blogList)

    ctx.body= result
})

module.exports = (router)
