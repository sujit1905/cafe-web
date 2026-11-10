import test from 'node:test';
import assert from 'node:assert/strict';
import { isPlaceholderMongoUri } from '../src/config/db.js';

test('detects an unset MongoDB URI', () => {
  assert.equal(isPlaceholderMongoUri(undefined), true);
});

test('detects the example MongoDB URI', () => {
  assert.equal(
    isPlaceholderMongoUri('mongodb+srv://username:password@cluster.mongodb.net/brewandbite'),
    true
  );
});

test('accepts a configured Atlas cluster URI', () => {
  assert.equal(
    isPlaceholderMongoUri('mongodb+srv://app-user:secret@cluster0.ab12.mongodb.net/brewandbite'),
    false
  );
});