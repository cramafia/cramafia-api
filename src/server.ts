import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as bodyParser from 'body-parser'
import { v2 as cloudinary } from 'cloudinary'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { MAX_BODY_SIZE } from './constants'

async function server() {
  const PORT = process.env.PORT || 5000
  const app = await NestFactory.create(AppModule, { cors: true })
  app.use(bodyParser.json({ limit: MAX_BODY_SIZE }))
  app.use(bodyParser.urlencoded({ limit: MAX_BODY_SIZE, extended: true }))

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })

  const config = new DocumentBuilder()
    .setTitle('cramafia-api')
    .setDescription('Documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build()
  const documentation = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api/docs', app, documentation)

  app.useGlobalPipes(new ValidationPipe())

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`))
}

server()
