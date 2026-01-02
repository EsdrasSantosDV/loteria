import { Provider } from '@nestjs/common/interfaces';
import { RecordDrawDomainService } from '../domain/services/abstract/record-draw.domain-service';
import { RecordDrawDomainServiceImpl } from '../domain/services/impl/record-draw.domain-service.impl';

export const serviceProviders: Provider[] = [
  {
    provide: RecordDrawDomainService,
    useClass: RecordDrawDomainServiceImpl,
  },
];
