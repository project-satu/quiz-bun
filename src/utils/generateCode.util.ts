import * as dayjs from 'dayjs';

export function GenerateTrxId(userId: number, packageId: number): string {
  const now = dayjs().format('DDMM');
  const random = Math.floor(Math.random() * 1000000);
  const code = `${userId}${packageId}-${now}${random}`;

  return code;
}
