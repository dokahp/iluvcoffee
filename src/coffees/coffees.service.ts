import { Injectable } from '@nestjs/common';
import { Coffee } from './entities/coffee.entities';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: "Shipreck Rost",
      brand: 'Buddy Brew',
      flavors: ['chocolate', 'vanilla']
    },
  ];

  findAll() {
    return this.coffees;
  }

  findOne(id: string) {
    return this.coffees.find(el => el.id === +id);
  }

  create(createcoffeeDto: any) {
    this.coffees.push(createcoffeeDto);
  }

  update(id: string, updateCoffeeDto: any) {
    const existedCoffee = this.findOne(id);
    if (existedCoffee) {
      // some update logic here
    }
  }

  remove(id: string) {
    const coffeeIndex = this.coffees.findIndex(el => el.id === +id);
    if (coffeeIndex >= 0) {
      this.coffees.splice(coffeeIndex, 1);
    }
  }
}
