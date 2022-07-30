a -> i <- b

항상 바깥의 a가 b를 참조,
그렇게 보려면 i, b가 같은 컴포넌트여야 한다.

ConsoleController -> [ UserInputPort <- UserInteractor ]
[ UserInteractor -> IUserDataAccess ] <- LocalUserRepository



생각을 해보자.
interactor와 controller에서 이미 검증을 하는데, data access에서 또 입력 검증을 할 필요가 있나?
입력 검증보다는 수행을 하다가 발생하는 에러만 던져주면 될 것이다.
