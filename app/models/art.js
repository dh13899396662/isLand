const { Op } = require('sequelize')
const { flatten } = require('lodash')
const { Movie, Music, Sentence } = require('./classic')

class Art {
    constructor (art_id, type) {
        this.art_id = art_id
        this.type = type
    }

    async getDetail (uid) {
        const { Favor } = require('./favor')
        
        const art = await Art.getData(this.art_id, this.type)
        if (!art) {
            throw new global.errs.NotFound()
        }
        const like = await Favor.userLikeIt(art.id, art.type, uid)
        return {
            art,
            like_status: like
        }
    }

    static async getList(artInfoList) {
        const artInfoObj = {
            100: [],
            2000: [],
            300: []
        }

        for (let artInfo of artInfoList) {
            artInfoObj[artInfo.type].push(artInfo.art_id)
        }
        const arts = []
        for (let key in artInfoObj) {
            const ids = artInfoObj[key]
            if (ids.length === 0) {
                continue
            }
            key = Number(key)
            arts.push(await Art._getListByType(ids, key))
        }
        return flatten(arts)
    }

    static async _getListByType(ids, type) {
        let arts = null
        const finder = {
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        }
        const scope = 'bh'
        switch(type) {
            case 100:
                arts = await Movie.scope(scope).findAll(finder)
                break;
            case 200:
                arts = await Music.scope(scope).findAll(finder)
                break
            case 300:
                arts = await Sentence.scope(scope).findAll(finder)
                break
            case 400: 
            break
            default:
                break
        }

        return arts
    }

    static async getData(artId, type, useScope = true) {
        let art = null
        const finder = {
            where: {
                id: artId
            }
        }
        const scope = useScope ? 'bh' : null
        switch(type) {
            case 100:
                art = await Movie.scope(scope).findOne(finder)
                break;
            case 200:
                art = await Music.scope(scope).findOne(finder)
                break
            case 300:
                art = await Sentence.scope(scope).findOne(finder)
                break
            case 400: 
                const { Book } = require('./book')
                art = await Book.scope(scope).findOne(finder)
                    if (!art) {
                        art = await Book.create({
                            id: artId
                        })
                    }
            break
            default:
                break
        }

        return art
    }
}

module.exports = {
    Art
}