import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';


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
  @HttpCode(HttpStatus.GONE)
  create(@Body() body) {
    return body;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return `this endpoint updates coffee - ${id}`
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `this endpoint deletes coffee - ${id}`
  }
}
