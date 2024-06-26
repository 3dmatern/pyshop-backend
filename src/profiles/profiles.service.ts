import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, PyShopProfile } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

export type Profile = {
  userId: string;
  name: string;
  tel: string;
  address: string;
  aboutMe: string;
};

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PyShopProfileCreateInput): Promise<PyShopProfile> {
    return this.prisma.pyShopProfile.create({ data });
  }

  async findOne(
    profileWhereUniqueInput: Prisma.PyShopProfileWhereUniqueInput,
  ): Promise<PyShopProfile | null> {
    return this.prisma.pyShopProfile.findUnique({
      where: profileWhereUniqueInput,
    });
  }

  async update(params: {
    where: Prisma.PyShopProfileWhereUniqueInput;
    data: Prisma.PyShopProfileUpdateInput;
  }): Promise<PyShopProfile> {
    const { where, data } = params;
    const { usernameTrim, isNotUsername } = this.validateUsername(data.name);

    if (isNotUsername) {
      throw new BadRequestException('Введите имя');
    }

    return this.prisma.pyShopProfile.update({
      data: { ...data, name: usernameTrim },
      where,
    });
  }

  private validateUsername(
    username: string | Prisma.StringFieldUpdateOperationsInput,
  ): {
    usernameTrim: string;
    isNotUsername: boolean;
  } {
    const usernameTrim = username.toString().trim();
    const isNotUsername =
      usernameTrim === '' ||
      usernameTrim.length < 2 ||
      usernameTrim.length > 30;

    return { usernameTrim, isNotUsername };
  }
}
