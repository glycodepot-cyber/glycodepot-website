import test from 'node:test';
import assert from 'node:assert/strict';
import {addressLines,adminMoney,adminDate,isOrderId,orderLabel,orderStatus} from '../lib/admin/order-format.ts';
import {salesMessage} from '../lib/email/sales-message.ts';
test('unpaid and failed checkouts remain distinct from paid orders',()=>{
 assert.equal(orderStatus('pending_payment'),'Awaiting payment');
 assert.equal(orderStatus('payment_failed'),'Payment failed');
 assert.equal(orderStatus('checkout_failed'),'Checkout failed');
 assert.equal(orderStatus('paid'),'Paid');
});
test('old and new saved address formats remain readable without object coercion',()=>{
 assert.deepEqual(addressLines({firstName:'Eva',lastName:'S',address1:'1 Lab Rd',city:'Potsdam',postal:'14476',country:'DE'}),['Eva S','1 Lab Rd','Potsdam, 14476','DE']);
 assert.deepEqual(addressLines({line1:'2 Old Rd',postalCode:'30318',country:'US'}),['2 Old Rd','30318','US']);
 assert.deepEqual(addressLines({line1:{secret:'ignored'}}),[]);
 assert.deepEqual(addressLines(null),[]);
});
test('order references and stored currencies are formatted without conversion',()=>{
 const id='6ad6e606-d66c-483f-8002-e140e140e140';
 assert.ok(isOrderId(id));assert.equal(isOrderId("';drop table orders"),false);
 assert.equal(orderLabel(id,'10008'),'#10008');assert.equal(orderLabel(id,null),id);
 assert.equal(adminMoney(694900,'EUR'),'€6,949.00');assert.equal(adminMoney(100,'USD'),'$1.00');
 assert.match(adminDate('2026-10-21T02:00:00Z'),/Oct 20, 2026/);
});
test('notification links resolve to the correct admin record type',()=>{
 const p={reference:'6ad6e606-d66c-483f-8002-e140e140e140',kind:'order',paid:false,name:'Customer',email:'test@example.com',productDetails:'Product'};
 assert.match(salesMessage(p,false).text,/https:\/\/www.glycodepot.com\/admin\/orders\/6ad6e606-d66c-483f-8002-e140e140e140/);
 assert.match(salesMessage({...p,kind:'quote'},false).text,/https:\/\/www.glycodepot.com\/admin\/quotes\//);
});
