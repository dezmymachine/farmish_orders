-- The original setup script actually already includes 'organisation' in user_profiles!
-- However, if your current database is missing it, you can run this:

alter table user_profiles add column if not exists organisation text;
