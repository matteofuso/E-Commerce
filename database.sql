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
                                quantita int not null,
                                rimosso tinyint(1) not null,
                                foreign key (utente) references utenti(id),
                                foreign key (bundle) references bundles(id),
                                foreign key (session) references sessioni(id)
);

create table carrello(
                         id int primary key auto_increment,
                         quantita int not null,
                         rimosso tinyint(1) not null,
                         utente int,
                         bundle int,
                         session int,
                         foreign key (utente) references utenti(id),
                         foreign key (bundle) references carrello_bundle(id),
                         foreign key (session) references sessioni(id)
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
                                 foreign key (session) references sessioni(id)
);