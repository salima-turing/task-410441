const crypto = require('crypto');

// Function to validate a digital signature
function validateSignature(data, signature, publicKey) {
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(data);
    return verify.verify(publicKey, signature, 'base64');
}

// Example usage:
const data = 'Hello, this is some data to be ingested.'; // The data being ingested
const signature = 'mP/1t4IxYG+bRNKz51FF1UQvs/ctgvhunM+uijsNtUCclkHUTXuEKJfAlLVMGKcn\n' +
    'oeHPOfBsIg/VkrLGVyGqVYePlbN+DS8iFTPiQJ+yGUO1mAhrrtcNjxVep98fIWVH\n' +
    'sGya29imPbm2Q2uTgpEm9yW6yIB2qGKVfVOz/oY/m7Tyi1Yr6JdWVbqgsCGs6tHE\n' +
    'OEEtrHqtHXV2P7vERVAME+3aMiutYI4gRac1nB2U4jhXvT+twmxFM7eDVfXk0Loe\n' +
    'oxD4jz51Bg5sAJs65TdhtFigP8uedmhuHWucCuHx3iXcPTYsLQ3jB4P4XxDuhbM8\n' +
    '29BnL56Vf4wZJQrVD8Sr1w==\n'; // The digital signature of the data
const publicKey = '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAx7RlcZbwdJkDpG8UcNmo\n' +
    'e0xJOz8yepLl+dJlbSpuW2i8i5JK7wH9BHjyvOsFIaKWmEvviXZUPJiq0wC7FDSJ\n' +
    'XlLji7xugU72jKLMSOOCguUxQx2+JajQN7yBjs5w5YOsn0FJ6fPHd3fBq4aE/11U\n' +
    'aC/7Gz8aMuxFLMJAOaFznOr1TnJNtlHg6678upvMAW6wf7NrdzAYNtLRqXHvoWvZ\n' +
    'qRYCQ2dcZXstsUqlYizH1tafokeevsWzE0FbkOvrOW8r/jf2S87YzqBnZikcpqaa\n' +
    'ccXfjKaqifpHQI7PQk8/DzHRRh6GiBm2WGE6pYew73fk5Zg4Ak3V9lz3amWKqGwg\n' +
    'twIDAQAB\n' +
    '-----END PUBLIC KEY-----\n'; // The public key used to verify the signature

if (validateSignature(data, signature, publicKey)) {
    console.log('Signature is valid. Data ingestion is secure.');
    // Process the data here
} else {
    console.log('Signature is invalid. Data ingestion is aborted.');
}
