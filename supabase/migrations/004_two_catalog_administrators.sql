begin;
do $$ begin
 if (select count(*) from auth.users where lower(email) in ('stasvisnakov15@gmail.com','3kuku66qq@gmail.com') and email_confirmed_at is not null) <> 2 then
  raise exception 'Both approved administrator accounts must exist and be confirmed';
 end if;
end $$;
update public.profiles set role='admin',name='Администратор'
where id in (select id from auth.users where lower(email) in ('stasvisnakov15@gmail.com','3kuku66qq@gmail.com'));
create or replace function private.is_admin() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.profiles p join auth.users u on u.id=p.id
 where p.id=auth.uid() and p.role='admin' and u.email_confirmed_at is not null
 and p.id in ('e1f33220-d4e1-4639-8d9d-07a70f1048e8'::uuid,'48a8bce1-b831-4bcb-a5a1-07f58a139d44'::uuid)
 and lower(u.email) in ('stasvisnakov15@gmail.com','3kuku66qq@gmail.com'));
$$;
commit;
