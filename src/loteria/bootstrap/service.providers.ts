import { Provider } from '@nestjs/common/interfaces';
import { RecordDrawDomainService } from '../domain/services/abstract/record-draw.domain-service';
import { RecordDrawDomainServiceImpl } from '../domain/services/impl/record-draw.domain-service.impl';
import { CreateLotteryDrawUseCaseImpl } from '../application/in/services/create-lottery-draw.use-case.impl';
import { CreateLotteryDrawUseCase } from '../application/in/use-cases/create-lottery-draw.use-case';
import { LotteryDefinitionRepositoryPort } from '../application/out/lottery-definition-repository.port';
import { LotteryDrawRepositoryPort } from '../application/out/lottery-draw-repository.port';

export const serviceProviders: Provider[] = [
  {
    provide: RecordDrawDomainService,
    useClass: RecordDrawDomainServiceImpl,
  },
  {
    provide: CreateLotteryDrawUseCase,
    useFactory: (
      defRepo: LotteryDefinitionRepositoryPort,
      drawRepo: LotteryDrawRepositoryPort,
    ) => new CreateLotteryDrawUseCaseImpl(defRepo, drawRepo),
    inject: [LotteryDefinitionRepositoryPort, LotteryDrawRepositoryPort],
  },
];
