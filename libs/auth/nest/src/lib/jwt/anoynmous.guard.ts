import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAuthGaurd extends AuthGuard(['jwt', 'anonymous']) {}
