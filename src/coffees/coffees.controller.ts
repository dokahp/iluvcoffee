import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {
  @Get()
  findAll() {
    return 'Return all coffees';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `this endpoint returns one coffee by it id=[${id}]`;
  }

  @Post()
  create(@Body() body) {
    return body;
  }
}
