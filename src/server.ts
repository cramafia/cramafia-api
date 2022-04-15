import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function server() {
  const PORT = process.env.PORT || 5000
  const app = await NestFactory.create(AppModule)

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
