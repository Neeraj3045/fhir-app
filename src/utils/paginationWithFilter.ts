import { 
IsNumber,
Min,
IsOptional,
Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationWithFilters {

@IsOptional()
filters?:any;

@IsOptional()
@Type(() => Number)
@IsNumber()
@Min(1)
page?: number;

@IsOptional()
@Type(() => Number)
@IsNumber()
@Min(1)
@Max(20)
limit?: number;

@IsOptional()
sort:any;
}
