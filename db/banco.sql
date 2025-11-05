drop database quimex;

create database quimex;

use quimex;

create table
    if not exists fornecedores (
        id int not null auto_increment primary key,
        nome varchar(255) not null,
        contato varchar(255) not null,
        localizacao varchar(255) not null,
        cnpj varchar(255) not null,
        loja_vinculada int not null,
        foreign key (loja_vinculada) references lojas (id),
        tipo_produto varchar(32)
    );

create table
    if not exists produtos_quimicos (
        id int not null auto_increment primary key,
        nome varchar(255) not null,
        composicao text not null,
        preco float (11, 2) not null,
        fornecedor int not null,
        codigoCor text not null,
        imagem text not null,
        filial text not null,
        sku text not null,
        classificacao text not null
        foreign key (fornecedor) references fornecedores (id)
    );

create table
    if not exists produtos (
        id int not null auto_increment primary key,
        nome varchar(255) not null,
        codigo_de_barras int not null,
        descricao varchar(255) not null,
        preco float (11, 2) not null,
        sku text not null,
        classificacao text not null,
        fornecedor int not null,
        codigoCor text not null,
        imagem text not null,
        filial text not null
        foreign key (fornecedor) references fornecedores (id)
    );

create table
    if not exists lojas (
        id int not null auto_increment primary key,
        nome varchar(255) not null,
        cnpj 
        localização varchar(255) not null,
        cep int not null,
        contato varchar(255) not null,
        horario_abertura time not null,
        horario_fechamento time not null
    );

create table
    if not exists usuarios (
        id int not null auto_increment primary key,
        nome varchar(255) not null,
        cpf varchar(255) not null,
        RE varchar(255) not null,
        senha varchar(255) not null,
        contato varchar(255) not null,
        sexo varchar(69) not null,
        cargo varchar(16) not null,
        vinculo varchar(255) not null,
        loja_vinculada int not null,
        foreign key (loja_vinculada) references lojas (id)
    );

create table
    if not exists estoque (
        id int not null auto_increment primary key,
        produto int not null,
        quantidade int not null,
        loja int not null,
        foreign key (produto) references produtos (id),
        foreign key (produto) references produtos_quimicos (id) foreign key (loja) references lojas (id)
    );

create table
    if not exists controle_diario (
        id int not null auto_increment primary key,
        funcionario int not null,
        abertura time not null,
        fechamento time not null,
        loja varchar(255),
        foreign key (funcionario) references usuarios (id)
    );

create table
    if not exists despesas (
        checkid int not null auto_increment primary key,
        loja int not null,
        valor float (15, 2) not null,
        data date not null,
        descricao text not null,
        tipo enum ("entrada", "saida") not null,
        foreign key (loja) references lojas (id)
    );

create table
    if not exists notificacao (
        id int primary key not null auto_increment,
        rm int not null,
        texto text not null,
        cargo enum ('adm', 'tecnico', 'comum'),
        area int not null,
        id_pool int not null,
        foreign key (area) references servicos (id),
        foreign key (id_pool) references pool (id)
    );

create table
    if not exists notificacao_usuario (
        id int primary key not null auto_increment,
        rm int not null,
        notificacao int not null,
        cargo enum ('adm', 'tecnico', 'comum')
    );