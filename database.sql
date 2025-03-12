create database aeternum;
use aeternum;

create table prodotti(
                         id int primary key auto_increment,
                         marca varchar(100) not null,
                         modello varchar(100) not null,
                         descrizione varchar(500) not null,
                         prezzo decimal(10,2) check (prezzo > 0)
);

create table categorie(
                          id int primary key auto_increment,
                          nome varchar(100) not null
);

create table categorizzazioni(
                                 id int primary key auto_increment,
                                 categoria int not null,
                                 prodotto int not null,
                                 unique(categoria, prodotto),
                                 foreign key (categoria) references categorie(id),
                                 foreign key (prodotto) references prodotti(id)
);

create table caratteristiche(
                                id int primary key auto_increment,
                                titolo varchar(100) not null,
                                descrizione varchar(500) not null
);

create table caratterizzazioni(
                                  id int primary key auto_increment,
                                  caratteristica int not null,
                                  prodotto int not null,
                                  unique(caratteristica, prodotto),
                                  foreign key (caratteristica) references caratteristiche(id),
                                  foreign key (prodotto) references prodotti(id)
);

create table colori(
                       id int primary key auto_increment,
                       colore varchar(100) not null,
                       hex char(7) not null,
                       prodotto int not null,
                       foreign key (prodotto) references prodotti(id)
);

create table immagini(
                         id int primary key auto_increment,
                         uri varchar(100) not null,
                         colore int not null,
                         foreign key (colore) references colori(id)
);

create table taglie(
                       id int primary key auto_increment,
                       taglia varchar(100) not null
);

create table disponibilita(
                              id int primary key auto_increment,
                              taglia int not null,
                              colore int not null,
                              disponibili int not null,
                              venduti int not null,
                              unique (taglia, colore),
                              foreign key (taglia) references taglie(id),
                              foreign key (colore) references colori(id)
);

create table bundles(
                        id int primary key auto_increment,
                        nome varchar(100) not null,
                        descrizione varchar(500) not null,
                        prezzo decimal(10, 2) check (prezzo > 0),
                        immagine varchar(100) not null
);

create table prodotti_bundle(
                                id int primary key auto_increment,
                                bundle int not null,
                                prodotto int not null,
                                unique(bundle, prodotto),
                                foreign key (bundle) references bundles(id),
                                foreign key (prodotto) references prodotti(id)
);

create table ruoli(
                      id int primary key auto_increment,
                      ruolo varchar(100) not null unique
);

create table utenti(
                       id int primary key auto_increment,
                       nome varchar(100) not null,
                       cognome varchar(100) not null,
                       email varchar(100) not null,
                       password char(64) not null,
                       ruolo int not null,
                       foreign key (ruolo) references ruoli(id)
);

create table dati_spedizione_fatturazione(
                                             utente int primary key,
                                             nome varchar(100) not null,
                                             cognome varchar(100) not null,
                                             cf char(16) not null,
                                             indirizzo varchar(200) not null,
                                             citta varchar(100) not null,
                                             cap char(5) not null,
                                             foreign key (utente) references utenti(id)
);

create table sessioni(
                         id int primary key auto_increment,
                         session_id varchar(256) not null unique,
                         utente int,
                         foreign key (utente) references utenti(id)
);

create table carrello_bundle(
                                id int primary key auto_increment,
                                bundle int not null,
                                utente int,
                                session int,
                                rimosso tinyint(1) not null default 0,
                                foreign key (utente) references utenti(id),
                                foreign key (bundle) references bundles(id),
                                foreign key (session) references sessioni(id) on delete cascade
);

create table prodotti_carello_bundle(
                                        id int primary key auto_increment,
                                        bundle int not null,
                                        prodotto int not null,
                                        colore int not null,
                                        taglia int not null,
                                        foreign key (prodotto) references prodotti(id),
                                        foreign key (colore) references colori(id),
                                        foreign key (taglia) references taglie(id),
                                        foreign key (bundle) references carrello_bundle(id)
);

create table carrello(
                         id int primary key auto_increment,
                         quantita int not null default 1,
                         utente int,
                         session int,
                         prodotto int not null,
                         colore int not null,
                         taglia int not null,
                         foreign key (utente) references utenti(id),
                         foreign key (prodotto) references prodotti(id),
                         foreign key (session) references sessioni(id) on delete cascade,
                         foreign key (colore) references colori(id),
                         foreign key (taglia) references taglie(id)
);

create table promocodes(
                           id int primary key auto_increment,
                           code varchar(100) not null unique,
                           sconto decimal(10, 2),
                           sconto_percentuale decimal(10, 2)
);

create table promocodes_usati(
                                 id int primary key auto_increment,
                                 promocode int not null,
                                 utente int,
                                 session int,
                                 unique(promocode, utente, session),
                                 foreign key (utente) references utenti(id),
                                 foreign key (promocode) references promocodes(id),
                                 foreign key (session) references sessioni(id) on delete cascade
);

insert into ruoli(ruolo) values ("Utente"), ("Dipendente"), ("Amministratore");

INSERT INTO categorie (nome) VALUES ('Sport');

INSERT INTO prodotti (marca, modello, descrizione, prezzo)
VALUES
    ('Garmin', 'Forerunner 945', 'Orologio GPS per la corsa con funzioni avanzate di allenamento e mappe integrate.', 599.99),
    ('Suunto', '9 Baro', 'Orologio sportivo con batteria a lunga durata e altimetro barometrico.', 499.99),
    ('Polar', 'Vantage V2', 'Smartwatch multisport con GPS e monitoraggio avanzato del recupero.', 479.99),
    ('Coros', 'Vertix 2', 'Orologio ultraresistente con navigazione avanzata e grande autonomia.', 699.99),
    ('Garmin', 'Fenix 7', 'Orologio GPS multisport premium con funzioni avanzate per l\'outdoor.', 799.99),
('Amazfit', 'T-Rex Pro', 'Smartwatch rugged con GPS e certificazione militare.', 179.99),
('Casio', 'G-Shock GBD-H1000', 'Orologio sportivo con cardiofrequenzimetro e GPS integrato.', 399.99),
('Fitbit', 'Sense 2', 'Smartwatch avanzato con monitoraggio dello stress e della salute.', 299.99),
('Apple', 'Watch Ultra', 'Smartwatch premium per sport estremi con GPS di precisione.', 899.99);

INSERT INTO categorizzazioni (categoria, prodotto)
SELECT (SELECT id FROM categorie WHERE nome = 'Sport'), id
FROM prodotti
WHERE modello IN ('Forerunner 945', '9 Baro', 'Vantage V2', 'Vertix 2', 'Fenix 7', 'T-Rex Pro', 'G-Shock GBD-H1000', 'Sense 2', 'Watch Ultra');

INSERT INTO caratteristiche (titolo, descrizione)
VALUES
('Autonomia', 'Fino a 14 giorni in modalità smartwatch'),
('GPS', 'Multibanda con mappe a colori'),
('Sensori', 'Cardio, pulsossimetro, altimetro'),
('Peso', '50g'),
('Batteria', 'Fino a 170 ore in modalità Ultra'),
('Resistenza', 'Impermeabile fino a 100m'),
('Altimetro', 'Barometrico FusedAlti™'),
('Materiale', 'Vetro zaffiro e cassa in titanio'),
('Durata batteria', 'Fino a 40 ore in modalità allenamento'),
('Test fitness', 'Running Performance, Cycling Performance'),
('Analisi sonno', 'Monitoraggio avanzato con fasi di sonno'),
('Autonomia', 'Fino a 140 ore in modalità GPS'),
('Display', '1.4" a colori con touch'),
('Mappe', 'Offline con navigazione turn-by-turn'),
     ('Materiale', 'Titanio grado 5 con vetro zaffiro'),
     ('Dimensioni', 'Disponibile in 42mm, 47mm e 51mm'),
     ('Funzioni', 'TopoActive, pagamenti Garmin Pay'),
     ('Resistenza', '10 ATM, standard militare MIL-STD-810'),
     ('Certificazione', '15 standard militari MIL-STD-810G'),
     ('Sensori', 'BioTracker 2 PPG, accelerometro a 3 assi'),
     ('Impermeabilità', '10 ATM (100 metri)'),
     ('Ricarica', 'Solare con backup USB'),
     ('Robustezza', 'Shock-resistant, standard G-Shock'),
     ('Tasto', 'Action Button personalizzabile e Digital Crown');

INSERT INTO caratterizzazioni (caratteristica, prodotto)
SELECT caratteristiche.id, prodotti.id
FROM caratteristiche, prodotti
WHERE prodotti.modello IN ('Forerunner 945', '9 Baro', 'Vantage V2', 'Vertix 2', 'Fenix 7', 'T-Rex Pro', 'G-Shock GBD-H1000', 'Sense 2', 'Watch Ultra')
  AND caratteristiche.titolo IN
      ('Autonomia', 'GPS', 'Sensori', 'Peso', 'Batteria', 'Resistenza', 'Altimetro', 'Materiale', 'Durata batteria', 'Test fitness', 'Analisi sonno', 'Display', 'Mappe', 'Funzioni', 'Certificazione', 'Impermeabilità', 'Ricarica', 'Robustezza', 'Tasto');

INSERT INTO colori (colore, hex, prodotto)
VALUES
    ('nero', '#000000', 1),
    ('blu', '#0000FF', 1),
    ('nero', '#000000', 2),
    ('grigio', '#808080', 2),
    ('nero', '#000000', 3),
    ('nero', '#000000', 4),
    ('nero', '#000000', 5),
    ('grigio', '#808080', 5),
    ('nero', '#000000', 6),
    ('nero', '#000000', 7),
    ('nero', '#000000', 8),
    ('nero', '#000000', 9);

INSERT INTO immagini (uri, colore)
VALUES
    ('images/1.jpeg', 1),
    ('images/2.jpeg', 1),
    ('images/2.jpeg', 2),
    ('images/3.jpeg', 3),
    ('images/4.jpeg', 4),
    ('images/5.jpeg', 5),
    ('images/6.jpeg', 6),
    ('images/7.jpeg', 7),
    ('images/8.jpeg', 8),
    ('images/9.jpeg', 9),
    ('images/10.jpeg', 10),
    ('images/11.jpeg', 11),
    ('images/12.jpeg', 12);

INSERT INTO taglie (taglia)
VALUES
    ('S'),
    ('M'),
    ('L');

INSERT INTO disponibilita (taglia, colore, disponibili, venduti)
VALUES
    (1, 9, 100, 0),
    (1, 10, 100, 0),
    (1, 11, 100, 0),
    (1, 12, 100, 0),
    (1, 1, 100, 0),
    (2, 1, 100, 0),
    (3, 2, 100, 0),
    (1, 3, 100, 0),
    (1, 4, 100, 0),
    (1, 5, 100, 0),
    (1, 6, 100, 0),
    (2, 7, 100, 0),
    (1, 8, 100, 0);

-- Inserisci il primo bundle (Luxury Starter Pack)
INSERT INTO bundles (nome, descrizione, prezzo, immagine)
VALUES ('Luxury Starter Pack', 'Perfect introduction to luxury watches', 19999.99, 'images/eleganti.jpeg');

-- Inserisci il secondo bundle (Sports Enthusiast Bundle)
INSERT INTO bundles (nome, descrizione, prezzo, immagine)
VALUES ('Sports Enthusiast Bundle', 'Essential watches for active lifestyles', 1499.99, 'images/sportivi.jpeg');

-- Associa i prodotti al primo bundle (Luxury Starter Pack)
INSERT INTO prodotti_bundle (bundle, prodotto) VALUES
                                                   (1, 1),
                                                   (1, 3),
                                                   (1, 5);

-- Associa i prodotti al secondo bundle (Sports Enthusiast Bundle)
INSERT INTO prodotti_bundle (bundle, prodotto) VALUES
                                                   (2, 2),
                                                   (2, 4),
                                                   (2, 6);