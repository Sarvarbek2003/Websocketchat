import { Module,Global } from '@nestjs/common';
import { pg } from './pg.service';

@Global()
@Module({
    providers: [pg],
    exports: [pg]
})
export class PgModule {}
