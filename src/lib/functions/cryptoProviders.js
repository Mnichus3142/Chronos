import crypto from 'crypto'

export function generateKeys(password) {
    const hash = crypto.createHash('sha256').update(password).digest()
    
    const ecdh = crypto.createECDH('secp256k1')
    ecdh.setPrivateKey(hash)

    const publicKey = ecdh.getPublicKey('hex')
    const privateKey = ecdh.getPrivateKey('hex')

    return { publicKey, privateKey }
}

export function encryptMessage(publicKeyRecipient, message, privateKeySender) {
    const ecdhSender = crypto.createECDH('secp256k1')
    ecdhSender.setPrivateKey(Buffer.from(privateKeySender, 'hex'))

    const sharedSecret = ecdhSender.computeSecret(Buffer.from(publicKeyRecipient, 'hex'))

    const key = crypto.createHash('sha256').update(sharedSecret).digest('base64').substr(0, 32)

    const iv = crypto.randomBytes(16)

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
    let encrypted = cipher.update(message, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    return { encryptedMessage: encrypted, iv: iv.toString('hex') }
}

export function decryptMessage(privateKeyRecipient, encryptedMessage, iv, publicKeySender) {
    const ecdhRecipient = crypto.createECDH('secp256k1')
    ecdhRecipient.setPrivateKey(Buffer.from(privateKeyRecipient, 'hex'))

    const sharedSecret = ecdhRecipient.computeSecret(Buffer.from(publicKeySender, 'hex'))

    const key = crypto.createHash('sha256').update(sharedSecret).digest('base64').substr(0, 32)

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'))
    let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
}