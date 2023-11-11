import VoteModel from '../../models/admin/vote.model'
import PresentationsModel from '../../models/admin/presentations.model'
import type { vote } from './types'

class VoteController {
  public async getVotes () {
    try {
      return await VoteModel.findAll()
    } catch (error) {
      throw error
    }
  }

  public async getVotesByTabID (tab_id: number) {
    try {
      return await VoteModel.findOne({
        where: {
          tab_id
        },
        include: PresentationsModel
      })
    } catch (error) {
      throw error
    }
  }

  public async getVote (vote_id: number) {
    try {
      return await VoteModel.findOne({
        where: {
          vote_id
        },
        include: PresentationsModel
      })
    } catch (error) {
      throw error
    }
  }

  public async createVote ({ tab_id, tab_name }: vote) {
    try {
      return await VoteModel.create({
        tab_id,
        tab_name
      })
    } catch (error) {
      throw error
    }
  }

  public async deleteVote (vote_id: number) {
    try {
      const vote = await VoteModel.findOne({ where: { vote_id } })

      if (!vote) {
        return {
          success: false,
          message: 'Vote wasn\'t found'
        }
      }

      await vote.destroy()

      return {
        success: true,
        message: 'OK'
      }
    } catch (error) {
      throw error
    }
  }

  public async updateVote ({ vote_id, tab_id, tab_name }: vote) {
    try {
      await VoteModel.update({
        tab_id,
        tab_name
      }, {
        returning: true,
        where: {
          vote_id
        }
      })

      return {
        success: true,
        message: 'OK'
      }
    } catch (error) {
      throw error
    }
  }
}

export default VoteController
