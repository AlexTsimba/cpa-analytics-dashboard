import { describe, it, expect, beforeEach } from 'vitest';
import {
  waitForCondition,
  waitForElement,
  waitForElementText,
  pollUntil,
  createDeferred,
  withTimeout,
} from '../helpers/async-test-helpers';
import { domUtils } from '../helpers/environment-helpers';

describe('Enhanced Testing Environment - Async Utilities', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('waitForCondition', () => {
    it('should wait for condition to be met', async () => {
      let condition = false;

      setTimeout(() => {
        condition = true;
      }, 100);

      const result = await waitForCondition(() => condition);
      expect(result).toBe(true);
    });

    it('should timeout if condition is not met', async () => {
      await expect(
        waitForCondition(() => false, { timeout: 100 })
      ).rejects.toThrow();
    });
  });

  describe('waitForElement', () => {
    it('should wait for element to appear in DOM', async () => {
      setTimeout(() => {
        const div = document.createElement('div');
        div.id = 'test-element';
        document.body.appendChild(div);
      }, 50);

      const element = await waitForElement('#test-element');
      expect(element).toBeTruthy();
      expect(element.id).toBe('test-element');
    });
  });

  describe('waitForElementText', () => {
    it('should wait for element to contain specific text', async () => {
      const div = document.createElement('div');
      div.id = 'text-element';
      document.body.appendChild(div);

      setTimeout(() => {
        div.textContent = 'Hello World';
      }, 50);

      const element = await waitForElementText('#text-element', 'Hello World');
      expect(element.textContent).toContain('Hello World');
    });
  });

  describe('pollUntil', () => {
    it('should poll until predicate returns true', async () => {
      let counter = 0;

      const result = await pollUntil(
        () => ++counter,
        (value) => value >= 3,
        { interval: 10 }
      );

      expect(result).toBe(3);
    });
  });

  describe('createDeferred', () => {
    it('should create a deferred promise', async () => {
      const deferred = createDeferred<string>();

      setTimeout(() => {
        deferred.resolve('test value');
      }, 50);

      const result = await deferred.promise;
      expect(result).toBe('test value');
    });
  });

  describe('withTimeout', () => {
    it('should resolve when promise completes within timeout', async () => {
      const promise = new Promise((resolve) =>
        setTimeout(() => resolve('success'), 50)
      );

      const result = await withTimeout(promise, 100);
      expect(result).toBe('success');
    });

    it('should reject when promise exceeds timeout', async () => {
      const promise = new Promise((resolve) =>
        setTimeout(() => resolve('success'), 150)
      );

      await expect(withTimeout(promise, 100)).rejects.toThrow('timed out');
    });
  });
});

describe('Enhanced Testing Environment - DOM Utilities', () => {
  describe('domUtils', () => {
    it('should create clean environment', () => {
      document.body.innerHTML = '<div>existing content</div>';

      const env = domUtils.createCleanEnvironment();

      expect(document.body.innerHTML).toBe('');
      expect(env.document).toBe(document);
      expect(env.window).toBeDefined();
    });

    it('should set viewport dimensions', () => {
      domUtils.setViewport(1024, 768);

      expect(window.innerWidth).toBe(1024);
      expect(window.innerHeight).toBe(768);
    });

    it('should create elements with attributes', () => {
      const element = domUtils.createElement(
        'button',
        {
          'data-testid': 'test-button',
          class: 'btn-primary',
        },
        'Click me'
      );

      expect(element.tagName).toBe('BUTTON');
      expect(element.getAttribute('data-testid')).toBe('test-button');
      expect(element.getAttribute('class')).toBe('btn-primary');
      expect(element.textContent).toBe('Click me');
    });

    it('should simulate user interactions', () => {
      const button = domUtils.createElement('button', {}, 'Click me');
      document.body.appendChild(button);

      let clicked = false;
      button.addEventListener('click', () => {
        clicked = true;
      });

      domUtils.userInteractions.click(button);
      expect(clicked).toBe(true);
    });
  });
});
