import type { SalesPayload, QuoteAddress } from "./client";

export function quoteEstimateName(reference:string) {
  return `RFQ ${reference.replace(/-/g,"").slice(0,16)}`;
}

function address(value:QuoteAddress) {
  return {addressLine1:value.address1,city:value.city,state:value.state,postalCode:value.postal,countryCode:value.country};
}
function addressText(value:QuoteAddress) {
  return [value.name,value.company,value.address1,value.city,value.state,value.postal,value.country,value.phone].filter(Boolean).join(", ");
}

export function draftEstimateBody(payload:SalesPayload,locationId:string,contactId:string,opportunityId:string) {
  if (payload.kind !== "quote" || !payload.quoteDetails?.items.length) throw new Error("Structured quote details are missing");
  const q = payload.quoteDetails;
  const issued=new Date();
  const expires=new Date(issued.getTime()+35*24*60*60*1000);
  if (!q.billing.address1 || !q.billing.city || !q.billing.country || !q.shipping.address1 || !q.shipping.country) throw new Error("Quote addresses are incomplete");
  for(const item of q.items) {
    if (!Number.isInteger(item.quantity) || item.quantity<1 || (item.unitPriceCents!==null && (!Number.isSafeInteger(item.unitPriceCents) || item.unitPriceCents<0))) throw new Error("Invalid quote item");
  }
  return {
    altId:locationId,altType:"location",liveMode:true,
    name:quoteEstimateName(payload.reference),title:"GLYCODEPOT ESTIMATE",currency:"USD",
    issueDate:issued.toISOString().slice(0,10),expiryDate:expires.toISOString().slice(0,10),
    businessDetails:{name:"Glycodepot LLC",phoneNo:"+19566953603",website:"https://glycodepot.com",logoUrl:"https://glycodepot.com/Glycodepot_Logo.jpeg",customValues:[],address:{addressLine1:"1445 Woodmont Ln NW Suite 183",city:"Atlanta",state:"GA",postalCode:"30318",countryCode:"US"}},
    contactDetails:{id:contactId,name:q.billing.name,email:payload.email,companyName:q.billing.company,...payload.phone?{phoneNo:payload.phone}:{},address:address(q.billing)},
    sentTo:{email:[payload.email],emailCc:[],emailBcc:[],phoneNo:[]},attachments:[],estimateNumberPrefix:"Quote-",
    items:q.items.map(item=>({name:item.name,description:[item.sku?`SKU: ${item.sku}`:undefined,item.url,item.unitPriceCents===null?"Price requires manual review before sending":undefined].filter(Boolean).join("\n"),currency:"USD",amount:(item.unitPriceCents??0)/100,qty:item.quantity,taxes:[],type:"one_time",taxInclusive:false})),
    discount:{type:"percentage",value:0},frequencySettings:{enabled:false},automaticTaxesEnabled:false,
    autoInvoice:{enabled:true,directPayments:true},
    termsNotes:`Shipping address: ${addressText(q.shipping)}\nBilling address: ${addressText(q.billing)}\nResearch Use Only. Pricing and availability apply to the quantities and pack sizes listed in this estimate.`,
    meta:{websiteReference:payload.reference,websiteOpportunityId:opportunityId,shippingAddress:q.shipping,billingAddress:q.billing,requiresPriceReview:true},
    // Omitting sendEstimateDetails is intentional: this creates an unsent
    // draft. The human's Send action is the price-approval gate.
  };
}

export class GhlEstimateClient {
  constructor(private readonly config:{token:string;locationId:string;version?:string},private readonly transport:typeof fetch=fetch) {
    if(!config.token||!config.locationId) throw new Error("Estimate connection is not configured");
  }
  private async request<T>(path:string,method="GET",body?:unknown):Promise<T> {
    const response=await this.transport(`https://services.leadconnectorhq.com${path}`,{method,headers:{Authorization:`Bearer ${this.config.token}`,Version:this.config.version??"2021-07-28","Content-Type":"application/json"},...(body===undefined?{}:{body:JSON.stringify(body)}),cache:"no-store",redirect:"error",signal:AbortSignal.timeout(10_000)});
    if(!response.ok)throw new Error(`GHL HTTP ${response.status}`);
    return response.json();
  }
  async checkAccess() {
    const query=new URLSearchParams({altId:this.config.locationId,altType:"location",limit:"1",offset:"0"});
    await this.request(`/invoices/estimate/list?${query}`);
    await this.request(`/invoices/?${query}`);
    return {estimatesReadable:true,invoicesReadable:true};
  }
  async websiteEstimateStatuses(references:string[]) {
    const query=new URLSearchParams({altId:this.config.locationId,altType:"location",search:"RFQ",limit:"100",offset:"0"});
    const result=await this.request<{estimates:Array<{_id:string;name:string;estimateNumber?:number;status?:string;meta?:{websiteReference?:string}}> }>(`/invoices/estimate/list?${query}`);
    if(!Array.isArray(result.estimates))throw new Error("Estimate list response is invalid");
    return result.estimates.flatMap(e=>{
      const reference=references.find(ref=>e.meta?.websiteReference===ref||e.name===quoteEstimateName(ref));
      return reference?[{id:e._id,reference,number:e.estimateNumber,status:e.status}]:[];
    });
  }
  async ensureDraft(payload:SalesPayload,contactId:string,opportunityId:string):Promise<{id:string;number?:string}> {
    const body=draftEstimateBody(payload,this.config.locationId,contactId,opportunityId);
    const query=new URLSearchParams({altId:this.config.locationId,altType:"location",search:body.name,contactId,limit:"100",offset:"0"});
    const result=await this.request<{estimates:Array<{_id:string;name:string;estimateNumber?:number;meta?:{websiteReference?:string}}> }>(`/invoices/estimate/list?${query}`);
    if(!Array.isArray(result.estimates))throw new Error("Estimate list response is invalid");
    const existing=result.estimates.find(row=>row.name===body.name);
    if(existing?.meta?.websiteReference&&existing.meta.websiteReference!==payload.reference)throw new Error("Estimate reference collision");
    if(existing?._id)return {id:existing._id,number:existing.estimateNumber?.toString()};
    const created=await this.request<{_id:string;estimateNumber?:number}>("/invoices/estimate","POST",body);
    if(!created._id)throw new Error("Estimate provider did not return an ID");
    return {id:created._id,number:created.estimateNumber?.toString()};
  }
}
