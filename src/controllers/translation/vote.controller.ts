import VoteAdminController from '../../controllers/admin/vote.controller'
import VoteModel from '../../models/translation/vote.model'
import type { vote } from './types'

class VoteController {
  public async getLikeVotes (presentation_id: number) {
    try {
      return VoteModel.findAll({
        where: {
          presentation_id,
          like: true
        }
      })
    } catch (error) {
      throw error
    }
  }

  public async getUserVotes ({ user_id, tab_id }: { user_id: number, tab_id: number }) {
    try {
      if (!(user_id && tab_id)) {
        return {
          success: false,
          message: 'Properties user_id and tab_id are required.'
        }
      }

      const vote_admin_controller = new VoteAdminController()
      const votes = (await vote_admin_controller.getVotesByTabID(tab_id))?.dataValues

      if (!votes) {
        return {
          success: false,
          data: {},
          message: 'There are no votes.'
        }
      }

      const user_votes = await VoteModel.findAll({
        where: {
          user_id
        }
      })

      return {
        data: {
          ...votes,
          presentations: votes.presentations.map((element: any) => {
            return {
              ...element.dataValues,
              is_like: user_votes.some(user_vote => user_vote.presentation_id === element.presentation_id && user_vote.like)
            }
          })
        }
      }
    } catch (error) {
      throw error
    }
  }

  public async createVote ({ user_id, presentation_id, like = null }: vote) {
    try {
      if (!(user_id && presentation_id && like !== null)) {
        return {
          success: false,
          message: 'Properties user_id, presentation_id and like are required.'
        }
      }

      const user_vote = await VoteModel.findOne({
        where: {
          user_id,
          presentation_id
        }
      })

      if (user_vote) {
        await VoteModel.update({
          like
        }, {
          returning: true,
          where: {
            user_id,
            presentation_id
          }
        })
      } else {
        await VoteModel.create({
          user_id,
          presentation_id,
          like
        })
      }

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
