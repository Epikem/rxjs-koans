// base controller that receives input from outside world and calls interactors
// rx js

import { Subscription } from "rxjs";

export interface IController {
  run(): void;
}

export interface IRxController {
  run$(): Subscription;
}