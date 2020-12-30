import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtService, JwtSignOptions } from '@nestjs/jwt';
import { RedisService } from '../cache/redis.service';
import { HashService } from './hash.service';
import { User } from './user.entity';
import * as ms from 'ms';
import { UserRepository } from './user.repository';
import { TokenRepository } from './token.repository';
import * as days from 'dayjs';
import { Token } from './token.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

// logout, loginViaId, check, autehtnticate
// token repository, redis, emit envet user login, validate login and class-transformer
@Injectable()
export class AuthService {
  uid: string;
  user: User;
  isLoggedOut: boolean;
  isAuthenticated: boolean;
  authenticationAttempted: boolean;

  constructor(
    private userRepository: UserRepository,
    private readonly hash: HashService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly tokenRepository: TokenRepository,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    this.uid = 'email';
  }

  public async attempt(
    uid: string,
    password: string,
    options?: JwtSignOptions,
  ): Promise<{ token: string }> {
    return this.login(await this.verifyCredentials(uid, password), options);
  }

  protected markUserAsLoggedIn(user: User, authenticated?: boolean): void {
    this.user = user;
    this.isLoggedOut = false;
    authenticated && (this.isAuthenticated = true);
  }

  public async login(
    user: User,
    options?: JwtSignOptions,
  ): Promise<{ token: string }> {
    const token = this.jwt.sign({ [this.uid]: user[this.uid] }, options);

    await this.tokenRepository
      .create({
        token,
        user,
        expiresAt: days()
          .add(
            ms(this.config.get('jwt.signOptions.expiresIn', '15d')),
            'millisecond',
          )
          .format(),
      })
      .save();

    this.markUserAsLoggedIn(user, true);

    return { token };
  }

  public async authenticate(): Promise<any> {
    console.log(this.request.headers);

    // /**
    //  * Return early when authentication has already attempted for
    //  * the current request
    //  */
    // if (this.authenticationAttempted) {
    // 	return this.user
    // }
    // this.authenticationAttempted = true
    // /**
    //  * Ensure the "Authorization" header value exists
    //  */
    // const token = this.getBearerToken()
    // const { tokenId, value } = this.parsePublicToken(token)
    // /**
    //  * Query token and user
    //  */
    // const providerToken = await this.getProviderToken(tokenId, value)
    // const providerUser = await this.getUserById(providerToken.userId)
    // this.markUserAsLoggedIn(providerUser.user, true)
    // this.token = providerToken
  }

  public async verifyCredentials(uid: string, password: string): Promise<User> {
    if (!uid || !password) {
      throw new Error('Email and password mandotory');
    }

    const providerUser = await this.lookupUsingUid(uid);

    await this.verifyPassword(providerUser, password);

    return providerUser;
  }

  private async verifyPassword(
    providerUser: User,
    password: string,
  ): Promise<void> {
    if (!(await this.hash.verify(password, providerUser.password))) {
      throw new Error('Password not valid');
    }
  }

  private async lookupUsingUid(uid: string): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({
        where: [
          {
            [this.uid]: uid,
          },
        ],
      });
    } catch (error) {
      throw new Error('User nor found');
    }
  }
}
