import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { HashService } from './hash.service';
import { User } from './user.entity';
import * as ms from 'ms';
import { UserRepository } from './user.repository';
import { TokenRepository } from './token.repository';
import * as days from 'dayjs';
import { REQUEST } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { Token } from './token.entity';
import { MoreThan } from 'typeorm';

export class InvalidApiToken extends HttpException {
  constructor() {
    super('Invalid API token', HttpStatus.UNAUTHORIZED);
  }
}

@Injectable()
export class AuthService {
  uid: keyof User;
  user: User;
  token: Token;
  isLoggedOut: boolean;
  isAuthenticated: boolean;
  authenticationAttempted: boolean;

  constructor(
    private userRepository: UserRepository,
    private readonly hash: HashService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly tokenRepository: TokenRepository,
    @Inject(REQUEST) private readonly request: FastifyRequest,
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

    const tokens = await this.tokenRepository.find({
      where: {
        user,
      },
    });

    await this.tokenRepository.remove(tokens);

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

  private getBearerToken(token?: string): string {
    if (!token) {
      throw new InvalidApiToken();
    }

    const [type, value] = token.split(' ');

    if (!type || type.toLowerCase() !== 'bearer' || !value) {
      throw new InvalidApiToken();
    }

    return value;
  }

  public async authenticate(): Promise<User> {
    if (this.authenticationAttempted) {
      return this.user;
    }

    this.authenticationAttempted = true;

    const token = this.getBearerToken(this.request.headers.authorization);

    try {
      this.jwt.verify(token);

      const providerToken = await this.tokenRepository.findOneOrFail({
        relations: ['user'],
        where: [
          {
            expiresAt: MoreThan(days().format()),
            token,
          },
        ],
      });

      this.token = providerToken;

      this.markUserAsLoggedIn(providerToken.user, true);

      return providerToken.user;
    } catch (error) {
      throw new InvalidApiToken();
    }
  }

  public async check(): Promise<boolean> {
    await this.authenticate();

    return this.isAuthenticated;
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

  public async logout(): Promise<void> {
    if (!this.authenticationAttempted) {
      await this.check();
    }

    if (this.token) {
      await this.token.remove();
    }

    this.markUserAsLoggedOut();
  }

  protected markUserAsLoggedOut(): void {
    this.isLoggedOut = true;
    this.isAuthenticated = false;
    this.user = null;
  }

  public async loginViaId(
    id: string | number,
    options?: JwtSignOptions,
  ): Promise<any> {
    const providerUser = await this.userRepository.findOneOrFail({
      where: [
        {
          id,
        },
      ],
    });

    return this.login(providerUser, options);
  }
}
