

const {AtRelation} = require('../db/model/index')

/**
 * 
 * @param {number} blofId 
 * @param {number} userID 
 */
async function createAtRelation(blofId,userID){
    const result = await AtRelation.create({
        blogId,
        userId
    })

    return result.dataValues

}

module.exports ={
    createAtRelation
}
