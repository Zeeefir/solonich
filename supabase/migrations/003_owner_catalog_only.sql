begin;
-- Only the confirmed owner account may manage the catalog.
create or replace function private.is_admin() returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid()='e1f33220-d4e1-4639-8d9d-07a70f1048e8'::uuid
 and exists(select 1 from public.profiles where id=auth.uid() and role='admin');
$$;
-- Disable cancelled features without deleting retained data.
revoke all on public.reviews,public.review_replies from anon,authenticated;
revoke execute on function public.record_visit(uuid,uuid,text,uuid),private.record_visit(uuid,uuid,text,uuid),public.visitor_stats(),private.visitor_stats() from anon,authenticated;
commit;
