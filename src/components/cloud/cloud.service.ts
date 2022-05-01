import { ForbiddenException, Injectable } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'
import { DEFAULT_ICONS_FOLDER, USERS_AVATARS_FOLDER } from './constants'

@Injectable()
export class CloudService {
  async getRandomDefaultIcon() {
    try {
      const { resources } = await cloudinary.api.resources({
        resource_type: 'image',
        type: 'upload',
        prefix: DEFAULT_ICONS_FOLDER,
      })
      const randomIndex = Math.round(Math.random() * (resources.length - 1))

      return resources[randomIndex].url
    } catch (e) {
      throw new ForbiddenException({
        message: e.error.message,
      })
    }
  }

  async uploadUserAvatar(image: string) {
    try {
      const { url } = await cloudinary.uploader.upload(image, {
        folder: USERS_AVATARS_FOLDER,
      })

      return url
    } catch (e) {
      throw new ForbiddenException({
        message: e.error.message,
      })
    }
  }
}
