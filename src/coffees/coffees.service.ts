import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';


@Injectable()
export class CoffeesService {
  
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>
  ) {}

  async findAll() {
    return await this.coffeeRepository.find();
  }

  async findOne(id: string) {
    const coffee = await this.coffeeRepository.findOne({where: {id: +id}});
    if (!coffee) {
      // throw new HttpException(`Coffee with id=${id} not found`, HttpStatus.NOT_FOUND);
      throw new NotFoundException(`Coffee with id=${id} not found`);
    }
    return coffee;
  }

  create(createcoffeeDto: CreateCoffeeDto) {
    const coffee =  this.coffeeRepository.create(createcoffeeDto);
    return this.coffeeRepository.save(coffee);
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto
    })
    if (!coffee) {
      throw new NotFoundException(`Coffee with id=${id} not found`)
    }
    return this.coffeeRepository.save(coffee);
  }

  async remove(id: string) {
    const coffee = await this.coffeeRepository.findOne({where: {id: +id}});
    return this.coffeeRepository.remove(coffee);
  }
}
