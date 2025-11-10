import { describe, it, expect } from 'vitest';
import { SOFT_DELETE_MODELS, isSoftDeleteModel } from '../../config/softDelete';

describe('ソフトデリート設定', () => {
  describe('SOFT_DELETE_MODELS', () => {
    it('Setとして定義されている', () => {
      expect(SOFT_DELETE_MODELS).toBeInstanceOf(Set);
    });

    it('必要なモデルが全て含まれている', () => {
      const expectedModels = [
        'card',
        'customer',
        'alchemystyle',
        'reward',
        'mapnode',
        'metacurrency',
        'metaprogress',
        'metaskill',
        'gamesystem',
      ];

      expectedModels.forEach((model) => {
        expect(SOFT_DELETE_MODELS.has(model)).toBe(true);
      });
    });

    it('全て小文字で定義されている', () => {
      SOFT_DELETE_MODELS.forEach((model) => {
        expect(model).toBe(model.toLowerCase());
      });
    });
  });

  describe('isSoftDeleteModel', () => {
    it('ソフトデリート対応モデルの場合trueを返す', () => {
      expect(isSoftDeleteModel('card')).toBe(true);
      expect(isSoftDeleteModel('customer')).toBe(true);
      expect(isSoftDeleteModel('alchemystyle')).toBe(true);
    });

    it('大文字小文字を区別しない', () => {
      expect(isSoftDeleteModel('Card')).toBe(true);
      expect(isSoftDeleteModel('CARD')).toBe(true);
      expect(isSoftDeleteModel('Customer')).toBe(true);
      expect(isSoftDeleteModel('CUSTOMER')).toBe(true);
    });

    it('ソフトデリート非対応モデルの場合falseを返す', () => {
      expect(isSoftDeleteModel('unknownModel')).toBe(false);
      expect(isSoftDeleteModel('test')).toBe(false);
      expect(isSoftDeleteModel('user')).toBe(false);
    });

    it('undefinedの場合falseを返す', () => {
      expect(isSoftDeleteModel(undefined)).toBe(false);
    });

    it('空文字列の場合falseを返す', () => {
      expect(isSoftDeleteModel('')).toBe(false);
    });
  });

  describe('設定の保守性', () => {
    it('Setを使用することで高速な検索が可能', () => {
      // Setのhas操作はO(1)で、配列のincludesよりも高速
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        isSoftDeleteModel('card');
      }
      const end = performance.now();

      // 1000回の検索が10ms以内で完了することを確認
      expect(end - start).toBeLessThan(10);
    });

    it('新しいモデルの追加が容易', () => {
      // このテストはドキュメント的な意味合い
      // 新しいモデルを追加する場合:
      // 1. Prismaスキーマに deletedAt フィールドを追加
      // 2. SOFT_DELETE_MODELSに追加
      expect(SOFT_DELETE_MODELS.size).toBeGreaterThan(0);
    });
  });
});
