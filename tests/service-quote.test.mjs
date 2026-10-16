import test from 'node:test';
import assert from 'node:assert/strict';
import {serviceQuoteItem} from '../lib/crm/service-quote.ts';
import {draftEstimateBody} from '../lib/crm/estimate-client.ts';
const customer={name:'Test User',email:'test@example.invalid',company:'Research Lab',address1:'1 Test St',city:'Atlanta',state:'GA',postal:'30318',country:'US',notes:'Target structure: test glycan; amount: 10 mg; manual feasibility review.'};
const request={service:'custom-glycan-synthesis',lines:[],customer};
test('service intake cannot replace or reprice catalog items',()=>{
 assert.equal(serviceQuoteItem({...request,service:undefined}),null);
 assert.throws(()=>serviceQuoteItem({...request,service:'unrecognized'}));
 assert.throws(()=>serviceQuoteItem({...request,lines:[{productId:'catalog-item',quantity:1}]}));
 for (const patch of [{notes:'short'},{notes:'x'.repeat(10001)},{company:''},{address1:''},{billingAddress:{address1:'incomplete'}}]) {
  assert.throws(()=>serviceQuoteItem({...request,customer:{...customer,...patch}}));
 }
});
test('synthesis intake yields an unsent estimate requiring manual price approval',()=>{
 const item=serviceQuoteItem({...request,price:1,name:'Injected price'});
 assert.equal(item.unitPriceCents,null);
 assert.match(item.name,/manual price approval/);
 const body=draftEstimateBody({reference:'test-service',kind:'quote',paid:false,name:customer.name,email:customer.email,productDetails:item.name,quoteDetails:{billing:customer,shipping:customer,items:[item]}},'location','contact','opportunity');
 assert.equal(body.items[0].amount,0);
 assert.equal(body.meta.requiresPriceReview,true);
 assert.equal(body.sendEstimateDetails,undefined);
 assert.match(body.items[0].description,/manual review/);
});
