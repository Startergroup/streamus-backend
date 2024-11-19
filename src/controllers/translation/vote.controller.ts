import type { vote } from './types'
import VoteModel from '../../models/translation/vote.model'

class VoteController {
  public async getUserVotes (code_id: number) {
    try {
      return await VoteModel.findAll({
        where: {
          user_id: code_id
        }
      }) || []
    } catch (error) {
      throw error
    }
  }

  public async createVote ({ user_id, lecture_id, schedule_id }: vote) {
    try {
      if (!(user_id && lecture_id && schedule_id)) {
        new Error('Invalid code id or lecture_id')
        return
      }

      const vote = await VoteModel.findOne({
        where: {
          lecture_id,
          user_id,
          schedule_id
        }
      })

      await vote?.destroy()

      if (vote) {
        new Error('User already voted')
        return
      }

      return await VoteModel.create({
        user_id,
        lecture_id,
        schedule_id
      })
    } catch (error) {
      throw error
    }
  }

  public async getVoteReport (schedule_id: number) {
    try {
      return await VoteModel.findAll({
        where: {
          schedule_id
        }
      })
    } catch (error) {
      throw error
    }
  }
}

export default VoteController
