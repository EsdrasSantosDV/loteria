import { Provider } from '@nestjs/common/interfaces';
import { RecordDrawDomainService } from '../domain/services/abstract/record-draw.domain-service';
import { RecordDrawDomainServiceImpl } from '../domain/services/impl/record-draw.domain-service.impl';
import { CreateLotteryDrawUseCaseImpl } from '../application/in/services/create-lottery-draw.use-case.impl';
import { CreateLotteryDrawUseCase } from '../application/in/use-cases/create-lottery-draw.use-case';
import { LotteryDefinitionRepositoryPort } from '../application/out/lottery-definition-repository.port';
import { LotteryDrawRepositoryPort } from '../application/out/lottery-draw-repository.port';
import { LotteryBetRepositoryPort } from '../application/out/lottery-bet-repository.port';
import { OpenLotteryDrawUseCaseImpl } from '../application/in/services/open-lottery-draw.use-case.impl';
import { OpenLotteryDrawUseCase } from '../application/in/use-cases/open-lottery-draw.use-case';
import { CloseLotteryDrawUseCaseImpl } from '../application/in/services/close-lottery-draw.use-case.impl';
import { CloseLotteryDrawUseCase } from '../application/in/use-cases/close-lottery-draw.use-case';
import { ApplyDrawResultUseCaseImpl } from '../application/in/services/apply-draw-result.use-case.impl';
import { ApplyDrawResultUseCase } from '../application/in/use-cases/apply-draw-result.use-case';
import { CreateLotteryBetUseCaseImpl } from '../application/in/services/create-lottery-bet.use-case.impl';
import { CreateLotteryBetUseCase } from '../application/in/use-cases/create-lottery-bet.use-case';
import { CreateQuickBetUseCaseImpl } from '../application/in/services/create-quick-bet.use-case.impl';
import { CreateQuickBetUseCase } from '../application/in/use-cases/create-quick-bet.use-case';
import { RandomNumberGeneratorDomainService } from '../domain/services/abstract/random-number-generator.domain-service';
import { RandomNumberGeneratorDomainServiceImpl } from '../domain/services/impl/random-number-generator.domain-service.impl';

export const serviceProviders: Provider[] = [
  {
    provide: RecordDrawDomainService,
    useClass: RecordDrawDomainServiceImpl,
  },
  {
    provide: RandomNumberGeneratorDomainService,
    useClass: RandomNumberGeneratorDomainServiceImpl,
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
      recordDrawDomainService: RecordDrawDomainService,
    ) =>
      new ApplyDrawResultUseCaseImpl(
        drawRepo,
        defRepo,
        recordDrawDomainService,
      ),
    inject: [
      LotteryDrawRepositoryPort,
      LotteryDefinitionRepositoryPort,
      RecordDrawDomainService,
    ],
  },
  {
    provide: CreateLotteryBetUseCase,
    useFactory: (
      drawRepo: LotteryDrawRepositoryPort,
      defRepo: LotteryDefinitionRepositoryPort,
      betRepo: LotteryBetRepositoryPort,
    ) => new CreateLotteryBetUseCaseImpl(drawRepo, defRepo, betRepo),
    inject: [
      LotteryDrawRepositoryPort,
      LotteryDefinitionRepositoryPort,
      LotteryBetRepositoryPort,
    ],
  },
  {
    provide: CreateQuickBetUseCase,
    useFactory: (
      drawRepo: LotteryDrawRepositoryPort,
      defRepo: LotteryDefinitionRepositoryPort,
      betRepo: LotteryBetRepositoryPort,
      randomNumberGenerator: RandomNumberGeneratorDomainService,
    ) =>
      new CreateQuickBetUseCaseImpl(
        drawRepo,
        defRepo,
        betRepo,
        randomNumberGenerator,
      ),
    inject: [
      LotteryDrawRepositoryPort,
      LotteryDefinitionRepositoryPort,
      LotteryBetRepositoryPort,
      RandomNumberGeneratorDomainService,
    ],
  },
];
