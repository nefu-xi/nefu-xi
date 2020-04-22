/**
 * @description 首页 controller
 * @author XI
 */

const xss = require('xss')
const { createBlog,getFollowersBlogList } = require('../services/blog')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { createBlogFailInfo } = require('../model/ErrorInfo')

const { PAGE_SIZE, REG_FOR_AT_WHO } = require('../conf/constant')
const { getUserInfo } = require('../services/user')
const { createAtRelation } = require('../services/at-relation')

/**
 * 创建微博
 * @param {Object} param0 创建微博所需的数据 { userId, content, image }
 */
async function create({ userId, content, image }) {
    const atUserNameList =[]
    content = content.replace(
        REG_FOR_WHO,
        (matchStr,nickName,userName) =>{

            atUserNameList.push(userName)
            return matchStr
        }

    )

    const atUserList = await Promise.all(
        atUserNameList.map(userName => getUserInfo(userName))
        

    )
    const atUserIdList = atUserList.map(user => user.id)




    
    try {
        // 创建微博
        const blog = await createBlog({
            userId,
            content: xss(content),
            image
        })
        await Promise.all(atUserIdList.map(
            userId => createAtRelation(blog.id,userId)
        ))
        


        
        return new SuccessModel(blog)
    } catch (ex) {
        console.error(ex.message, ex.stack)
        return new ErrorModel(createBlogFailInfo)
    }
}

/**
 * 
 * @param {number} userId 
 * @param {number} pageIndex page index
 */
async function getHomeBlogList(userId,pageIndex=0){
    const result = await getFollowersBlogList(
        {
            userId,
            pageIndex,
            pageSize:PAGE_SIZE
        }
        
    )

    const {count,blogList} = result

    return new SuccessModel({
        isEmpty:blogList.length === 0,
        blogList,
        pageSize:PAGE_SIZE,
        pageIndex,
        count
    })
}

module.exports = {
    create,
    getHomeBlogList
}