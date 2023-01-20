import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import { Event } from 'src/events/entities/event.entity/event.entity';
import { coffeeBrands, coffeeFlavors, coffeeNames } from './coffee-constants';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event]), TelegrafModule],
  exports: [CoffeesService],
  controllers: [CoffeesController],
  providers: [CoffeesService]
})
export class CoffeesModule {}
