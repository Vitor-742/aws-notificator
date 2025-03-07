import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Put('/start-services')
  startServices() {
    this.productsService.startServices();
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Post('/email')
  subscribeEmail(@Body() { email_address }) {
    return this.productsService.subscribeEmail(email_address);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Delete('/delete-services')
  deleteServices() {
    return this.productsService.deleteServices();
  }

  @Get('/deploy')
  deployLambda() {
    return this.productsService.deployLambda();
  }

  @Delete(':product_name')
  remove(@Param('product_name') id: string) {
    return this.productsService.remove(id);
  }
}
