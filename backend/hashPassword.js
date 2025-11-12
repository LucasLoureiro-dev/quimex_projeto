import bcrypt from 'bcryptjs';

export default async function generateHashedPassword(password) {
  const user_password = '123'; // Substitua pela senha que você deseja hashear
  try {
    // Gerar o salt
    const salt = await bcrypt.genSalt(10);

    // Hashear a senha com o salt
    const hashedPassword = await bcrypt.hash(user_password, salt);

    console.log('Senha Hasheada:', hashedPassword);
    return hashedPassword;
  } catch (error) {
    console.error('Erro ao hashear a senha:', error);
    process.exit(1); // Encerra o processo com código de erro
  }
}

generateHashedPassword();