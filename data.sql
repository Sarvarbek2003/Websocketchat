create database websocket;

drop table if exists users;
create table users(
    user_id serial primary key not null,
    username varchar(32) unique not null,
    password varchar(32) not null,
    createdAt timestamptz default current_timestamp,
    socket_id varchar(64) null,
    online boolean default false,
);

drop table if exists chats;
create table  (
    from_user_id int references users(user_id) not null,
    to_user_id int references users(user_id) not null,
    message_id serial primary key, 
    message varchar(1000),
    time timestamptz default current_timestamp
);

insert into users (username, password) values ('Olimjon', '1111');
insert into chats (from_user_id, to_user_id, message) values (1, 3, 'rostan');

select * from chats where from_user_id in (3) order by time;

ALTER TABLE users
ADD COLUMN online boolean default false;


CREATE OR REPLACE FUNCTION mychat (fromUserId int, toUserId int) returns table(from_id int, to_id int, msg_id int, msg character varying, message_time timestamptz) language plpgsql as $$ 
    begin 
        return query (select from_user_id, to_user_id, message_id, message, time from chats where from_user_id in (fromUserId,toUserId) and to_user_id in (fromUserId,toUserId) order by time);
    end;
$$; 

