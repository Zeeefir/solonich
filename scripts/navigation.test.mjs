import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getActiveSection } from '../src/activeSection.mjs';

test('mobile navigation keeps tall advantages active until contacts reach the marker', () => {
 assert.equal(getActiveSection([{id:'catalog',top:-2300},{id:'about',top:-1200},{id:'advantages',top:92},{id:'contacts',top:1900}],180),'advantages');
 assert.equal(getActiveSection([{id:'catalog',top:-3500},{id:'about',top:-2400},{id:'advantages',top:-1108},{id:'contacts',top:700}],180),'advantages');
 assert.equal(getActiveSection([{id:'catalog',top:-4200},{id:'about',top:-3100},{id:'advantages',top:-1808},{id:'contacts',top:100}],180),'contacts');
 assert.equal(getActiveSection([{id:'catalog',top:450},{id:'about',top:1800}],180),'catalog');
});
