import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
    const logger = new Logger('Bootstrap');

    const app = await NestFactory.create(AppModule, {
        cors: true,
    });

    // Préfixe global pour les routes HTTP
    app.setGlobalPrefix('api');

    // Validation globale (class-validator)
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: false,
            transform: true,
        }),
    );

    app.enableShutdownHooks();

    const port = Number(process.env.PORT || 3000);
    const host = process.env.HOST || '0.0.0.0'; // important en Docker

    await app.listen(port, host);

    logger.log(`🚀 App running at http://${host}:${port}/api`);
}
bootstrap();
