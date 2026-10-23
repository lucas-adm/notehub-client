import * as age from 'age-encryption';

export const encrypt = async (plaintext: string, passphrase: string): Promise<string> => {
    const encrypter = new age.Encrypter();
    encrypter.setPassphrase(passphrase);
    const ciphertext = await encrypter.encrypt(plaintext);
    return age.armor.encode(ciphertext);
}

export const decrypt = async (armored: string, passphrase: string): Promise<string> => {
    const decrypter = new age.Decrypter();
    decrypter.addPassphrase(passphrase);
    return decrypter.decrypt(age.armor.decode(armored), 'text');
}