import { Injectable } from '@nestjs/common';
import * as jwt from "jsonwebtoken";
import { z } from 'zod';

const JWT_SECRET = 'secret';
const JWT_TTL_SECONDS = 24 * 60 * 60; // 24 hours

@Injectable()
export class JwtService {
  constructor() { }

  public decode(token: string) {
    const decoded = jwt.decode(token, {
      json: true
    })
    return z.object({
      walletAddress: z.string()
    }).parse(decoded)
  }

  public verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET, {
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
      JWT_SECRET,
      {
        expiresIn: JWT_TTL_SECONDS,
      },
    );

    return {
      token
    }
  }
}
