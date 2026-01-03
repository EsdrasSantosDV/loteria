import { Provider } from '@nestjs/common/interfaces';
import { RecordDrawDomainService } from '../domain/services/abstract/record-draw.domain-service';
import { RecordDrawDomainServiceImpl } from '../domain/services/impl/record-draw.domain-service.impl';
import { CreateLotteryDrawUseCaseImpl } from '../application/in/services/create-lottery-draw.use-case.impl';
import { CreateLotteryDrawUseCase } from '../application/in/use-cases/create-lottery-draw.use-case';
import { LotteryDefinitionRepositoryPort } from '../application/out/lottery-definition-repository.port';
import { LotteryDrawRepositoryPort } from '../application/out/lottery-draw-repository.port';
import { OpenLotteryDrawUseCaseImpl } from '../application/in/services/open-lottery-draw.use-case.impl';
import { OpenLotteryDrawUseCase } from '../application/in/use-cases/open-lottery-draw.use-case';
import { CloseLotteryDrawUseCaseImpl } from '../application/in/services/close-lottery-draw.use-case.impl';
import { CloseLotteryDrawUseCase } from '../application/in/use-cases/close-lottery-draw.use-case';
import { ApplyDrawResultUseCaseImpl } from '../application/in/services/apply-draw-result.use-case.impl';
import { ApplyDrawResultUseCase } from '../application/in/use-cases/apply-draw-result.use-case';

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
  {
    provide: OpenLotteryDrawUseCase,
    useFactory: (drawRepo: LotteryDrawRepositoryPort) =>
      new OpenLotteryDrawUseCaseImpl(drawRepo),
    inject: [LotteryDrawRepositoryPort],
  },
  {
    provide: CloseLotteryDrawUseCase,
    useFactory: (drawRepo: LotteryDrawRepositoryPort) =>
      new CloseLotteryDrawUseCaseImpl(drawRepo),
    inject: [LotteryDrawRepositoryPort],
  },
  {
    provide: ApplyDrawResultUseCase,
    useFactory: (
      drawRepo: LotteryDrawRepositoryPort,
      defRepo: LotteryDefinitionRepositoryPort,
    ) => new ApplyDrawResultUseCaseImpl(drawRepo, defRepo),
    inject: [LotteryDrawRepositoryPort, LotteryDefinitionRepositoryPort],
  },
];
