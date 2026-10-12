import test from 'node:test';
import assert from 'node:assert/strict';
import {draftEstimateBody,GhlEstimateClient} from '../lib/crm/estimate-client.ts';
import {quoteAction,invoiceAction} from '../lib/crm/quote-policy.ts';
const billing={name:'Billing Person',company:'Billing Lab',address1:'Billing Street',city:'Boston',state:'MA',postal:'02110',country:'US'};
const shipping={name:'Shipping Person',company:'Shipping Lab',address1:'Shipping Street',city:'Austin',state:'TX',postal:'78701',country:'US'};
const quote={reference:'rfq-1',kind:'quote',paid:false,name:'Customer',email:'test@example.invalid',productDetails:'Test product',quoteDetails:{billing,shipping,items:[{productId:'p1',variantId:'v1',name:'Reagent — 50 G',sku:'SKU-50',quantity:3,unitPriceCents:37900,requiresDryIce:false},{productId:'p2',name:'Custom reagent',quantity:2,unitPriceCents:null,requiresDryIce:true}]}};
const sentAt='2026-10-01T12:00:00Z';
const state={status:'sent',sentAt,now:Date.parse(sentAt),sentDays:[],opportunityStatus:'open'};
test('draft uses billing as invoice address and retains separate shipping',()=>{
 const body=draftEstimateBody(quote,'location','contact','opportunity');
 assert.equal(body.contactDetails.address.addressLine1,'Billing Street');
 assert.equal(body.meta.shippingAddress.address1,'Shipping Street');
 assert.equal(body.items[0].amount,379);assert.equal(body.items[0].qty,3);
 assert.equal(body.items[1].amount,0);assert.match(body.items[1].description,/manual review/);
 assert.equal(body.meta.requiresPriceReview,true);assert.equal(body.sendEstimateDetails,undefined);
 assert.deepEqual(body.autoInvoice,{enabled:true,directPayments:true});
});
test('invalid structured prices or quantities never reach provider',()=>{
 assert.throws(()=>draftEstimateBody({...quote,quoteDetails:undefined},'l','c','o'));
 assert.throws(()=>draftEstimateBody({...quote,quoteDetails:{...quote.quoteDetails,items:[{...quote.quoteDetails.items[0],quantity:0}]}},'l','c','o'));
 assert.throws(()=>draftEstimateBody({...quote,quoteDetails:{...quote.quoteDetails,items:[{...quote.quoteDetails.items[0],unitPriceCents:-1}]}},'l','c','o'));
});
test('draft retry returns existing estimate and never sends or overwrites manually edited prices',async()=>{
 const calls=[];
 const client=new GhlEstimateClient({token:'secret',locationId:'location'},async(url,init)=>{calls.push({url,init});return Response.json({estimates:[{_id:'existing',name:'Website RFQ rfq-1',estimateNumber:99}]});});
 assert.deepEqual(await client.ensureDraft(quote,'contact','opportunity'),{id:'existing',number:'99'});
 assert.equal(calls.length,1);assert.equal(calls[0].init.method,'GET');
});
test('new request creates only an unsent draft, provider errors stay generic',async()=>{
 const calls=[];
 const client=new GhlEstimateClient({token:'secret',locationId:'location'},async(url,init)=>{calls.push({url,init});return init.method==='GET'?Response.json({estimates:[]}):Response.json({_id:'new',estimateNumber:100});});
 assert.equal((await client.ensureDraft(quote,'contact','opportunity')).id,'new');
 assert.equal(calls.length,2);assert.equal(JSON.parse(calls[1].init.body).sendEstimateDetails,undefined);
 const failing=new GhlEstimateClient({token:'secret',locationId:'location'},async()=>new Response('secret customer data',{status:403}));
 await assert.rejects(failing.ensureDraft(quote,'c','o'),{message:'GHL HTTP 403'});
});
test('follow-ups are due at days 2, 7, 14, 28 and never while draft',()=>{
 for(const day of [2,7,14,28])assert.equal(quoteAction({...state,now:Date.parse(sentAt)+day*86400000,sentDays:[2,7,14,28].filter(x=>x<day)}).day,day);
 assert.equal(quoteAction({...state,now:Date.parse(sentAt)+86400000}).kind,'wait');
 assert.equal(quoteAction({...state,status:'draft',now:Date.parse(sentAt)+50*86400000}).kind,'wait');
});
test('acceptance, decline, reply, pause, and manual closure stop follow-ups',()=>{
 assert.equal(quoteAction({...state,status:'accepted'}).kind,'invoice');
 assert.equal(quoteAction({...state,status:'declined'}).kind,'lost');
 for(const change of [{replied:true},{paused:true},{opportunityStatus:'won'},{opportunityStatus:'lost'}])assert.equal(quoteAction({...state,...change}).kind,'stop');
});
test('lost at day 35 requires the full sequence; outage recovery sends one latest reminder',()=>{
 const now=Date.parse(sentAt)+35*86400000;
 assert.equal(quoteAction({...state,now,sentDays:[2,7,14,28],lastFollowupAt:new Date(Date.parse(sentAt)+28*86400000).toISOString()}).kind,'lost');
 assert.equal(quoteAction({...state,now,sentDays:[2,7,14,28],lastFollowupAt:new Date(now).toISOString()}).kind,'wait');
 assert.equal(quoteAction({...state,now,sentDays:[2,7,14,28]}).kind,'wait');
 const missed=quoteAction({...state,now});assert.equal(missed.kind,'followup');assert.equal(missed.day,28);assert.deepEqual(missed.skipDays,[2,7,14]);
});
test('only a live paid invoice permits fulfillment, partial or processing payments do not',()=>{
 const invoice={sentAt,now:Date.parse(sentAt)+2*86400000,sentDays:[],liveMode:true};
 assert.equal(invoiceAction({...invoice,status:'paid'}).kind,'fulfill');
 assert.equal(invoiceAction({...invoice,status:'paid',liveMode:false}).kind,'stop');
 assert.equal(invoiceAction({...invoice,status:'partially_paid'}).kind,'payment_followup');
 assert.equal(invoiceAction({...invoice,status:'payment_processing'}).kind,'wait');
 assert.equal(invoiceAction({...invoice,status:'draft'}).kind,'wait');
});
