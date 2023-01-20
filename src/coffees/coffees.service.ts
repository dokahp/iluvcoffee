import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity/event.entity';
import { DataSource, Repository } from 'typeorm';
import { coffeeBrands, coffeeNames, coffeeFlavors } from './coffee-constants';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: DataSource,
    @InjectBot() private readonly bot: Telegraf,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return await this.coffeeRepository.find({
      relations: ['flavors'],
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string) {
    const coffee = await this.coffeeRepository.findOne({
      where: { id: +id },
      relations: ['flavors'],
    });
    if (!coffee) {
      // throw new HttpException(`Coffee with id=${id} not found`, HttpStatus.NOT_FOUND);
      throw new NotFoundException(`Coffee with id=${id} not found`);
    }
    return coffee;
  }

  async create(createcoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createcoffeeDto.flavors.map((flavor) => this.preloadFlavorByName(flavor)),
    );
    const coffee = this.coffeeRepository.create({
      ...createcoffeeDto,
      flavors,
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    // так как массива вкусов может не быть при обновлении делаем проверку
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((flavor) =>
          this.preloadFlavorByName(flavor),
        ),
      ));
    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee with id=${id} not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async remove(id: string) {
    const coffee = await this.coffeeRepository.findOne({ where: { id: +id } });
    return this.coffeeRepository.remove(coffee);
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({
      where: {
        name: name,
      },
    });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      coffee.recomendations++;
      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };
      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);
      await queryRunner.commitTransaction();

      this.sendRecommendationToBot(coffee);
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return coffee;
  }

  async sendRecommendationToBot(coffee: Coffee, date?: string): Promise<void> {
    const chatId = 741146240; // enter chat id
    const { id, name, brand, flavors, recomendations } = coffee;
    const idString = `<b>id: ${id}</b>\n`;
    const recommendString = `Number of recommendations: <b>${recomendations}</b>\n`;
    const nameString = `Name: <i>${name}</i>\n`;
    const brandString = `Brand: <u>${brand}</u>\n`;
    const flavorsString = `Flavors: ${flavors.map((el) => el.name).join(', ')}`;
    await this.bot.telegram.sendMessage(
      chatId,
      date + '\n' + idString + recommendString + nameString + brandString + flavorsString,
      { parse_mode: 'HTML' },
    );
  }

  @Cron('45 * * * * *')
  async funnyGeneratedCoffee() {
    const date = new Date();
    const dateFormatted =
      date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const monthFormatted =
      date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const outputDate = `${dateFormatted}-${monthFormatted}-${date.getFullYear()} ${date.toLocaleTimeString()}`;

    const randomCoffee: CreateCoffeeDto = {
      name: coffeeNames[Math.floor(Math.random() * coffeeNames.length)],
      brand: coffeeBrands[Math.floor(Math.random() * coffeeBrands.length)],
      flavors: Array.from(coffeeFlavors, (el) =>
        Math.round(Math.random()) ? el : undefined,
      ).filter((el) => el),
    };
    const newCoffee = await this.create(randomCoffee);
    this.sendRecommendationToBot(newCoffee, outputDate);
    
  }
}
