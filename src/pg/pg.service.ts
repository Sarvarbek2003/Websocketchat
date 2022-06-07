import { ConfigService, ConfigModule} from "@nestjs/config";
import { NestPgpromiseModule } from 'nestjs-pgpromise';
import { Injectable } from "@nestjs/common";

@Injectable()
export class pg{
    constructor(private config: ConfigService){
        
    }
}