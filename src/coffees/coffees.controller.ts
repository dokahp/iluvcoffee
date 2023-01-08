import { Controller, Get, Param } from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {
  @Get()
  findAll() {
    return 'Return all coffees';
  }
  @Get(':id')
  findOne(@Param() params) {
    return `this endpoint returns one coffee by it [${params.id}]`
  }
}
