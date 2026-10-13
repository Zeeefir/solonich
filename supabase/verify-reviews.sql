-- Run in SQL Editor. All fixture changes are rolled back.
begin;
select set_config('request.jwt.claim.sub','e1f33220-d4e1-4639-8d9d-07a70f1048e8',true);
set local role authenticated;
insert into public.reviews(store,rating,body) values ('Проверка в транзакции',5,'Проверка публикации без сохранения');
insert into public.review_replies(review_id,body)
select id,'Проверка ответа администратора' from public.reviews where store='Проверка в транзакции';
select author_name,rating,reply.body as admin_reply from public.reviews r join public.review_replies reply on reply.review_id=r.id where store='Проверка в транзакции';
reset role;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);
set local role authenticated;
do $$ begin
 begin
  insert into public.review_replies(review_id,body) select id,'Недопустимый ответ' from public.reviews where store='Проверка в транзакции';
  raise exception 'SECURITY TEST FAILED: customer reply accepted';
 exception when insufficient_privilege then raise notice 'PASS: non-admin reply denied'; end;
 begin
  perform public.visitor_stats();
  raise exception 'SECURITY TEST FAILED: customer statistics accepted';
 exception when insufficient_privilege then raise notice 'PASS: non-admin statistics denied'; end;
end $$;
reset role;
rollback;
