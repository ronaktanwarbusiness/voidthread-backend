// This file is deprecated. Please use @nestjs/config and ConfigService instead.
// Pre-loading environment variables here can cause issues with NestJS initialization order.

export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT;
