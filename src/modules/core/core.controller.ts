import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CoreService } from './core.service';

@Controller('core')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Get('products')
  async getProducts() {
    return this.coreService.getProducts();
  }

  @Post('variants')
  async getVariants(@Body('slug') slug: string) {
    return this.coreService.getVariantsByProductSlug(slug);
  }

  @Get('collections/:slug/products')
  async getProductsByCollection(@Param('slug') slug: string) {
    return this.coreService.getCollectionProducts(slug);
  }
}
