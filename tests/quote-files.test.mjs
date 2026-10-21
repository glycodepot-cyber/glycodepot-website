import test from 'node:test';
import assert from 'node:assert/strict';
import {validateQuoteFiles,MAX_QUOTE_FILE_BYTES} from '../lib/quote/file-policy.ts';

test('quote files allow scientific documents and structures within the total limit',()=>{
 assert.equal(validateQuoteFiles([]),null);
 assert.equal(validateQuoteFiles([{name:'glycan-structure.MOL',size:900},{name:'project brief.pdf',size:1200},{name:'case-study.docx',size:MAX_QUOTE_FILE_BYTES-2100}]),null);
});
test('quote file limits reject overflow, unsupported files, and unsafe filenames',()=>{
 for(const files of [
  Array.from({length:4},(_,i)=>({name:`file${i}.txt`,size:1})),
  [{name:'too-large.pdf',size:MAX_QUOTE_FILE_BYTES+1}],
  [{name:'a.pdf',size:MAX_QUOTE_FILE_BYTES},{name:'b.pdf',size:1}],
  [{name:'program.exe',size:100}], [{name:'page.html',size:100}],
  [{name:'script.svg',size:100}], [{name:'empty.txt',size:0}],
  [{name:'../structure.mol',size:10}], [{name:'evil\r\nheader.pdf',size:10}],
  [{name:'x'.repeat(181)+'.pdf',size:10}], [{name:'bad-size.pdf',size:-1}],
 ]) assert.ok(validateQuoteFiles(files));
});
