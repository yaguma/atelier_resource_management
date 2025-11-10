import { describe, it, expect } from 'vitest';
import {
  paginationQuerySchema,
  uuidSchema,
  validateUUID,
  assertUUID,
} from '../../utils/validation';

describe('バリデーションユーティリティ', () => {
  describe('paginationQuerySchema', () => {
    it('正常なページネーションパラメータを検証できる', () => {
      const result = paginationQuerySchema.parse({
        page: '2',
        limit: '20',
      });

      expect(result.page).toBe(2);
      expect(result.limit).toBe(20);
    });

    it('デフォルト値が適用される', () => {
      const result = paginationQuerySchema.parse({});

      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('無効な値の場合デフォルト値が適用される', () => {
      const result1 = paginationQuerySchema.parse({
        page: 'invalid',
        limit: 'invalid',
      });

      expect(result1.page).toBe(1);
      expect(result1.limit).toBe(10);
    });

    it('0以下の値の場合デフォルト値が適用される', () => {
      const result = paginationQuerySchema.parse({
        page: '0',
        limit: '-5',
      });

      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('limitが100を超える場合は100に制限される', () => {
      const result = paginationQuerySchema.parse({
        limit: '200',
      });

      expect(result.limit).toBe(100);
    });

    it('文字列から数値への変換が正しく行われる', () => {
      const result = paginationQuerySchema.parse({
        page: '5',
        limit: '25',
      });

      expect(typeof result.page).toBe('number');
      expect(typeof result.limit).toBe('number');
    });
  });

  describe('uuidSchema', () => {
    it('有効なUUIDを検証できる', () => {
      const validUUID = '550e8400-e29b-41d4-a716-446655440000';
      const result = uuidSchema.parse(validUUID);

      expect(result).toBe(validUUID);
    });

    it('無効なUUIDの場合エラーをスローする', () => {
      const invalidUUID = 'not-a-valid-uuid';

      expect(() => uuidSchema.parse(invalidUUID)).toThrow();
    });

    it('カスタムエラーメッセージが設定されている', () => {
      const invalidUUID = 'not-a-valid-uuid';

      try {
        uuidSchema.parse(invalidUUID);
      } catch (error: any) {
        expect(error.errors[0].message).toBe('有効なUUIDを指定してください');
      }
    });
  });

  describe('validateUUID', () => {
    it('有効なUUIDの場合trueを返す', () => {
      const validUUIDs = [
        '550e8400-e29b-41d4-a716-446655440000',
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      ];

      validUUIDs.forEach((uuid) => {
        expect(validateUUID(uuid)).toBe(true);
      });
    });

    it('無効なUUIDの場合falseを返す', () => {
      const invalidUUIDs = [
        'not-a-uuid',
        '550e8400-e29b-41d4-a716',
        '550e8400-e29b-41d4-a716-446655440000-extra',
        '',
        '123',
      ];

      invalidUUIDs.forEach((uuid) => {
        expect(validateUUID(uuid)).toBe(false);
      });
    });

    it('大文字小文字を区別しない', () => {
      const upperCaseUUID = '550E8400-E29B-41D4-A716-446655440000';
      const lowerCaseUUID = '550e8400-e29b-41d4-a716-446655440000';

      expect(validateUUID(upperCaseUUID)).toBe(true);
      expect(validateUUID(lowerCaseUUID)).toBe(true);
    });
  });

  describe('assertUUID', () => {
    it('有効なUUIDの場合エラーをスローしない', () => {
      const validUUID = '550e8400-e29b-41d4-a716-446655440000';

      expect(() => assertUUID(validUUID)).not.toThrow();
    });

    it('無効なUUIDの場合エラーをスローする', () => {
      const invalidUUID = 'not-a-uuid';

      expect(() => assertUUID(invalidUUID)).toThrow('有効なUUIDを指定してください');
    });
  });
});
