import { IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  product_name: string;

  @IsNumber()
  @IsPositive()
  desired_price: number;
}