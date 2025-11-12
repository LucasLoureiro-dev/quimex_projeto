create database quimex;
use quimex;
 
create table if not exists lojas (
id int auto_increment primary key not null,
nome varchar(255) not null,
cnpj varchar(15) not null,
localizacao varchar(255) not null,
contato varchar(20) not null,
horario_abertura time not null,
horario_fechamento time not null
);
INSERT INTO lojas (nome, cnpj, tipo, localizacao, estado, contato, horario_abertura, horario_fechamento) VALUES
('Matriz', '12.345.678/0001-00', 'Matriz', 'Pindamonhangaba', 'São Paulo', '96592-6890', '00:00:00', '23:59:59'),
('Filial Centro', '12.345.678/0002-10', 'Filial', 'Taubaté', 'São Paulo', '12 98845-3321', '07:30:00', '18:00:00'),
('Filial Leste', '23.456.789/0003-21', 'Filial', 'São José dos Campos', 'São Paulo', '12 99774-5562', '08:00:00', '17:30:00'),
('Filial Centro-Leste', '34.567.890/0004-32', 'Filial', 'Lorena', 'São Paulo', '12 99128-0045', '09:00:00', '19:00:00'),
('Filial Norte', '45.678.901/0005-43', 'Filial', 'Cruzeiro', 'São Paulo', '12 99812-4477', '07:00:00', '17:00:00'),
('Filial Sul', '56.789.012/0006-54', 'Filial', 'Guaratinguetá', 'São Paulo', '12 99665-7203', '08:00:00', '18:00:00'),
('Filial Oeste', '67.890.123/0007-65', 'Filial', 'Resende', 'Rio de Janeiro', '24 99412-3381', '08:00:00', '18:00:00'),
('Filial Centro-Oeste', '78.901.234/0008-76', 'Filial', 'Aparecida', 'São Paulo', '12 99877-6654', '07:30:00', '17:00:00'),
('Filial Industrial', '89.012.345/0009-87', 'Filial', 'Pindamonhangaba', 'São Paulo', '12 99561-8842', '06:00:00', '22:00:00'),
('Filial Alto Vale', '90.123.456/0010-98', 'Filial', 'Campos do Jordão', 'São Paulo', '12 99111-2244', '09:00:00', '17:00:00'),
('Filial Vale Norte', '11.222.333/0011-09', 'Filial', 'Jacareí', 'São Paulo', '12 99200-3301', '08:00:00', '18:00:00'),
('Filial Distrito Leste', '22.333.444/0012-10', 'Filial', 'Caçapava', 'São Paulo', '12 99988-5522', '08:00:00', '18:00:00'),
('Filial Distrito Sul', '33.444.555/0013-21', 'Filial', 'Bananal', 'São Paulo', '12 99770-1199', '07:00:00', '16:00:00'),
('Filial Distrito Norte', '44.555.666/0014-32', 'Filial', 'Queluz', 'São Paulo', '12 99188-2290', '08:00:00', '17:00:00'),
('Filial Parque Industrial', '55.666.777/0015-43', 'Filial', 'Tremembé', 'São Paulo', '12 99664-7741', '07:30:00', '19:00:00'),
('Filial Terminal Logístico', '66.777.888/0016-54', 'Filial', 'Roseira', 'São Paulo', '12 99441-0088', '00:00:00', '23:59:59'),
('Filial Aeroporto', '77.888.999/0017-65', 'Filial', 'São José dos Campos', 'São Paulo', '12 99101-7002', '05:00:00', '23:00:00'),
('Filial Portuária', '88.999.000/0018-76', 'Filial', 'Santos', 'São Paulo', '13 99288-3412', '07:00:00', '19:00:00'),
('Filial Zona Rural', '99.000.111/0019-87', 'Filial', 'Lagoinha', 'São Paulo', '12 99555-6678', '08:00:00', '16:00:00'),
('Filial Centro-Sul', '10.111.222/0020-98', 'Filial', 'São Luiz do Paraitinga', 'São Paulo', '12 99472-5589', '09:00:00', '18:00:00'),
('Filial Polo Agrícola', '21.222.333/0021-09', 'Filial', 'Cunha', 'São Paulo', '12 99833-2901', '07:00:00', '17:30:00');

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
create table
    if not exists produtos_quimicos (
        id int not null auto_increment primary key,
        nome varchar(255) not null,
        composicao text not null,
        preco float (11, 2) not null,
        fornecedor int not null,
        quantidade int not null,
        codigoCor text not null,
        imagem text not null,
        filial text not null,
        sku text not null,
        classificacao text not null,
        foreign key (fornecedor) references fornecedores (id)
    );
 
create table
    if not exists produtos (
        id int not null auto_increment primary key,
        nome varchar(255) not null,
        codigo_de_barras varchar(12) not null,
        descricao varchar(255) not null,
        preco float (11, 2) not null,
        sku text not null,
        quantidade int not null,
        classificacao text not null,
        fornecedor int not null,
        codigoCor text not null,
        imagem text not null,
        filial text not null,
        foreign key (fornecedor) references fornecedores (id)
    );
 
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