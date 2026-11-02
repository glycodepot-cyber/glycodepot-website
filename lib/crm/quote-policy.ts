const DAY=86_400_000;
export const QUOTE_FOLLOWUP_DAYS=[2,7,14,28] as const;
export const QUOTE_LOST_DAY=35;
export const PAYMENT_FOLLOWUP_DAYS=[2,7,14] as const;

export function quoteAction(input:{status:string;sentAt?:string;now:number;sentDays:number[];lastFollowupAt?:string;paused?:boolean;replied?:boolean;opportunityStatus:string}) {
  if(input.paused||input.replied||input.opportunityStatus!=="open")return {kind:"stop"} as const;
  if(input.status==="accepted"||input.status==="invoiced")return {kind:"invoice"} as const;
  if(input.status==="declined")return {kind:"lost",reason:"declined"} as const;
  if(!["sent","viewed"].includes(input.status)||!input.sentAt)return {kind:"wait"} as const;
  const sent=Date.parse(input.sentAt);
  if(!Number.isFinite(sent)||input.now<sent)return {kind:"wait"} as const;
  const age=(input.now-sent)/DAY;
  const due=QUOTE_FOLLOWUP_DAYS.filter(day=>age>=day&&!input.sentDays.includes(day));
  const lastFollowup=input.lastFollowupAt?Date.parse(input.lastFollowupAt):NaN;
  if(age>=QUOTE_LOST_DAY&&Number.isFinite(lastFollowup)&&input.now-lastFollowup>=7*DAY&&QUOTE_FOLLOWUP_DAYS.every(day=>input.sentDays.includes(day)))return {kind:"lost",reason:"no_response"} as const;
  // If the worker was offline, send only the latest due reminder, never burst
  // all missed follow-ups into the customer's inbox at once.
  if(due.length)return {kind:"followup",day:due[due.length-1],skipDays:due.slice(0,-1)} as const;
  return {kind:"wait"} as const;
}

export function invoiceAction(input:{status:string;sentAt?:string;now:number;sentDays:number[];paused?:boolean;liveMode:boolean}) {
  if(!input.liveMode)return {kind:"stop"} as const;
  if(input.status==="paid")return {kind:"fulfill"} as const;
  if(input.paused||!["sent","partially_paid"].includes(input.status)||!input.sentAt)return {kind:"wait"} as const;
  const sent=Date.parse(input.sentAt);
  if(!Number.isFinite(sent)||input.now<sent)return {kind:"wait"} as const;
  const due=PAYMENT_FOLLOWUP_DAYS.filter(day=>(input.now-sent)/DAY>=day&&!input.sentDays.includes(day));
  return due.length?{kind:"payment_followup",day:due[due.length-1],skipDays:due.slice(0,-1)} as const:{kind:"wait"} as const;
}
