import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ParamsWithId {

@IsNotEmpty({
    message:'Id is required'
})
@IsMongoId({
message:"Invalid  id"
})
  id: string;
}