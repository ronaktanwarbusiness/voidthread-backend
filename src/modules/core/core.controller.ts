import { Controller, Get, Param } from '@nestjs/common';
import { CoreService } from './core.service';

@Controller('core')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Get('collections/:slug/products')
  async getProductsByCollection(@Param('slug') slug: string) {
    return this.coreService.getCollectionProducts(slug);
  }
}
