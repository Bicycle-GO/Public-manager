import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../server.mjs';
import { sanitizeStudyState, questionSequence } from '../study-state.js';

test('Corrupt progress cannot crash exam history or inflate progress; valid records survive',()=>{
 const lessons=[{id:'1-01'}],questions=[{id:1,options:['a','b']}];
 const clean=sanitizeStudyState({completed:['1-01','1-01','missing'],bookmarks:['q1','q1','l1-01',null],answers:{1:1,999:0},activity:{'2026-09-30':2,other:'bad'},exams:[{date:'2026-09-30',total:1,correct:1,average:'100'},null],goal:0},lessons,questions);
 assert.deepEqual(clean.completed,['1-01']);assert.deepEqual(clean.bookmarks,['q1','l1-01']);
 assert.deepEqual(clean.answers,{1:1});assert.deepEqual(clean.activity,{'2026-09-30':2});
 assert.equal(clean.goal,5);assert.deepEqual(clean.exams,[]);
 assert.deepEqual(sanitizeStudyState({exams:{}},lessons,questions).exams,[]);
});

test('Opening a question keeps the chapter and filtered sequence instead of the whole subject',()=>{
 const a={id:1},b={id:2},c={id:3};
 assert.deepEqual(questionSequence(b,[b,c],[a,b,c]),{list:[b,c],index:0});
 assert.deepEqual(questionSequence(a,[b,c],[a,b,c]),{list:[a,b,c],index:0});
});

test('Password gate protects assets, rejects invalid sessions, and accepts the configured password',async t=>{
 const server=createServer({password:'jin'});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 t.after(()=>new Promise(resolve=>server.close(resolve)));
 const base=`http://127.0.0.1:${server.address().port}`;
 assert.match(await (await fetch(base)).text(),/접속 암호/);
 for(const path of ['/data.js','/app.js'])assert.equal((await fetch(base+path)).status,401);
 assert.equal((await fetch(base+'/data.js',{headers:{cookie:'jodalon_session=fake'}})).status,401);
 const wrong=await fetch(base+'/login',{method:'POST',body:'password=wrong',redirect:'manual'});assert.equal(wrong.status,401);
 const cross=await fetch(base+'/login',{method:'POST',body:'password=jin',headers:{origin:'http://unrelated.invalid'},redirect:'manual'});assert.equal(cross.status,403);
 const login=await fetch(base+'/login',{method:'POST',body:'password=jin',redirect:'manual'});assert.equal(login.status,303);
 const header=login.headers.get('set-cookie');assert.match(header,/HttpOnly/);assert.match(header,/SameSite=Strict/);
 const cookie=header.split(';')[0];
 assert.equal((await fetch(base+'/data.js',{headers:{cookie}})).status,200);
 assert.equal((await fetch(base+'/auth.mjs',{headers:{cookie}})).status,404);
 assert.equal((await fetch(base+'/tests/content.test.mjs',{headers:{cookie}})).status,404);
 assert.equal((await fetch(base+'/app.js',{headers:{cookie}})).headers.get('cache-control'),'no-store');
});
