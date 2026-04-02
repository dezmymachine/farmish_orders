-- SQL Script to update user_profiles table

alter table user_profiles add column if not exists location text;
