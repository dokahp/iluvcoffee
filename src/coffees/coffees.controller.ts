import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';


@Controller('coffees')
export class CoffeesController {
  @Get()
  findAll(@Query() pagination) {
    const {limit, offset} = pagination;
    return `Return all coffees. Limit: ${limit}, offset: ${offset}`;
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
