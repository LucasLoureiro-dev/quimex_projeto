drop database quimex;
create database quimex;
 
use quimex;
 
create table fornecedores(
	id int not null auto_increment primary key,
    nome varchar (255) not null,
    contato varchar(255) not null,
    localizacao varchar(255) not null,
    cnpj varchar(255) not null,
    loja_vinculada int not null,
    foreign key (loja_vinculada) references lojas(id),
    tipo_produto varchar(32)
);
    
create table produtos_quimicos(
	id int not null auto_increment primary key,
    nome varchar(255) not null,
    composicao text not null,
    preco float(11, 2) not null,
    fornecedor int not null
);
    
create table produtos(
	id int not null auto_increment primary key,
    nome varchar(255) not null,
    codigo_de_barras int not null,
    descricao varchar(255) not null,
    preco float(11, 2) not null,
    fornecedor int not null,
    foreign key (fornecedor) references fornecedores(id));

create table lojas(
	id int not null auto_increment primary key,
    nome varchar(255) not null,
    localização varchar(255) not null,
    cep int not null,
    contato varchar(255) not null,
    horario_abertura time not null,
    horario_fenchamento time not null);
 
create table usuarios(
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
    foreign key (loja_vinculada) references lojas(id)
);
    
create table estqoque (
	id int not null auto_increment primary key,
    produto int not null,
    quantidade int not null,
    foreign key (produto) references produtos(id),
    foreign key (produto) references produtos_quimicos(id)
);
    
create table controle_diario(
	id int not null auto_increment primary key,
    funcionario int not null,
    abertura time not null,
    fechamento time not null,
    loja varchar(255),
    foreign key (funcionario) references usuarios(id)
);
    
create table despesas(
	checkid int not null auto_increment primary key,
    loja int not null,
    valor float(15, 2) not null,
    data date not null,
    descricao text not null,
    tipo enum("entrada", "saida") not null,
    foreign key (loja) references lojas(id));