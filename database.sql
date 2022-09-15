\c postgres
DROP DATABASE bde;

CREATE DATABASE bde;

\c bde
-- A faire seulement si on peut placer les vidéos
-- CREATE TABLE image_defi (
--   image_id uuid DEFAULT gen_random_uuid () PRIMARY KEY,
--   image_name varchar(255) NOT NULL,
--   image_path varchar(255) NOT NULL,
--   image_user_id uuid NOT NULL REFERENCES polyuser (polyuser_id)
-- );
-- Nice to have
CREATE TABLE ROLE (
  role_id smallserial PRIMARY KEY,
  role_name varchar(100)
);

INSERT INTO ROLE (role_name)
  VALUES ('admin'), ('normal');

CREATE TABLE polyuser (
  polyuser_id uuid PRIMARY KEY,
  polyuser_name varchar(255) NOT NULL,
  polyuser_role int NOT NULL REFERENCES ROLE (role_id) DEFAULT 2,
  polyuser_mail varchar(255) UNIQUE NOT NULL,
  polyuser_password text NOT NULL,
  polyuser_lastlogin date NOT NULL DEFAULT now()
);

INSERT INTO polyuser (polyuser_id, polyuser_name, polyuser_role, polyuser_mail, polyuser_password)
  VALUES ('ea99489b-df58-4241-a30f-3d20a70a7d4c', 'Lucas Nouguier', 1, 'lucas.nouguier@protonmail.com', '$2a$10$DNf13uxFJ7GHgdtzWMpt6.xF4YU04Te1.VZ1Z4pbDPbgOLECBV8vW');

CREATE TABLE partenaire (
  partenaire_id uuid PRIMARY KEY,
  partenaire_name varchar(255) NOT NULL,
  partenaire_pic text,
  partenaire_short_description varchar(500) NOT NULL,
  partenaire_description text,
  partenaire_mail varchar(255) UNIQUE,
  partenaire_website_url varchar(255)
);

CREATE TABLE club (
  club_id uuid PRIMARY KEY,
  club_name varchar(255) NOT NULL,
  club_pic text,
  club_short_description varchar(500) NOT NULL,
  club_description text,
  club_fb text,
  club_ig text
);

CREATE TABLE event (
  event_id uuid PRIMARY KEY,
  event_name varchar(255) NOT NULL,
  event_short_description varchar(500) NOT NULL,
  event_pic text,
  event_description text,
  event_date date,
  event_time time,
  event_place varchar(255),
  event_datetime varchar(500),
  event_price float,
  event_club_id uuid REFERENCES club (club_id)
);

-- INSERT INTO partenaire (partenaire_name, partenaire_pic, partenaire_short_description, partenaire_description, partenaire_mail, partenaire_website_url)
--   VALUES ('Partenaire1', 'https://aws.random.cat/meow', 'kitty', 'kity cat', 'cat@kitty.com', 'www.kittycat.cat'), ('Partenaire2', 'https://aws.random.cat/meow', 'kitty2', 'kity cat2', 'cat2@kitty2.com', 'www.kittycat2.cat');
-- CREATE TABLE code_promo (
--   promo_id uuid DEFAULT gen_random_uuid () PRIMARY KEY,
--   partenaire_id uuid NOT NULL REFERENCES partenaire (partenaire_id) ON DELETE CASCADE,
--   promo_name varchar(255) NOT NULL,
--   promo_description text NOT NULL
-- );
-- INSERT INTO club (club_name, club_pic, club_short_description, club_description, club_fb, club_ig)
--   VALUES ('cluby', 'https://aws.random.cat/meow', 'mmm', 'meow', 'fb/meow', 'ig/meow'), ('cluba', 'https://aws.random.cat/meow', 'www', 'waf', 'fb/waf', 'ig/waf');
CREATE TABLE goodie (
  goodie_id uuid PRIMARY KEY,
  goodie_name varchar(255) NOT NULL,
  goodie_pic text,
  goodie_description text,
  goodie_price float CHECK (goodie_price >= 0)
);

