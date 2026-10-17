import test from 'node:test';
import assert from 'node:assert/strict';
import { salesMessage } from '../lib/email/sales-message.ts';

const request = { reference:'request-123',kind:'quote',paid:false,name:'Test Customer',email:'test@example.com',company:'Test Lab',productDetails:'2 × Research reagent — 10 G [SKU-10]\nhttps://glycodepot.com/products/reagents/sample',notes:'Shipping: Test address' };

test('RFQ email preserves product, pack, quantity, reference and customer reply address',()=>{
  const message=salesMessage(request,false);
  assert.match(message.subject,/New quote request/);
  assert.match(message.text,/2 × Research reagent — 10 G \[SKU-10\]/);
  assert.match(message.text,/request-123/);
  assert.match(message.text,/Shipping: Test address/);
  assert.equal(message.replyTo,'test@example.com');
  assert.doesNotMatch(message.subject,/Payment received/);
});
test('new unpaid order is labeled as an order, never a payment confirmation',()=>{
  const message=salesMessage({...request,kind:'order',value:123.45},false);
  assert.match(message.subject,/New order/);
  assert.match(message.text,/USD 123\.45/);
  assert.doesNotMatch(message.text,/Payment received/);
});
test('paid event produces a distinct payment notification for the same order',()=>{
  const paid={...request,kind:'order',paid:true,value:123.45};
  const created=salesMessage(paid,false), received=salesMessage(paid,true);
  assert.notEqual(created.subject,received.subject);
  assert.match(received.subject,/Payment received/);
  assert.match(received.text,/request-123/);
  assert.match(received.text,/USD 123\.45/);
});
