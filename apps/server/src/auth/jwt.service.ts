import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from "jsonwebtoken";
import { z } from 'zod';

import { SecretMissingError } from '../config/error'

@Injectable()
export class JwtService {

  private jwtSecret: string;
  private jwtTTL: number;

  constructor(
    private readonly config: ConfigService
  ) {
    const secret = this.config.get<string>('jwt.secret');
    const ttl = this.config.get<number>('jwt.ttl');

    if (!secret) throw new SecretMissingError('jwt.secret')
    if (!ttl) throw new SecretMissingError('jwt.ttl')

    this.jwtSecret = secret;
    this.jwtTTL = ttl;
  }

  public decode(token: string) {
    const decoded = jwt.decode(token, {
      json: true
    })
    return z.object({
      walletAddress: z.string()
    }).parse(decoded)
  }

  public verifyToken(token: string) {
    return jwt.verify(token, this.jwtSecret, {
      ignoreExpiration: false
    })
  }

  public issueToken(inputs: {
    user: string
  }) {
    const token = jwt.sign(
      {
        walletAddress: inputs.user
      },
      this.jwtSecret,
      {
        expiresIn: this.jwtTTL,
      },
    );

    return {
      token
    }
  }
}
