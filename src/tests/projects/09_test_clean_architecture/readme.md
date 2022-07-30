a -> i <- b

항상 바깥의 a가 b를 참조,
그렇게 보려면 i, b가 같은 컴포넌트여야 한다.

ConsoleController -> [ UserInputPort <- UserInteractor ]
[ UserInteractor -> IUserDataAccess ] <- LocalUserRepository

