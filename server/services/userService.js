import userDao from "../daos/userDAO.js";
import crypto from "crypto";

class UserService {
    async verifyUserCredentials(email, password) {
        const user = await userDao.getUserByEmail(email);
        if (!user) return null; 

        return new Promise((resolve, reject) => {
            crypto.scrypt(password, user.salt, 32, (err, hashedPassword) => {
                if (err) return reject(err);

                const savedHashBuffer = Buffer.from(user.hash, 'hex');
                if (!crypto.timingSafeEqual(savedHashBuffer, hashedPassword)) {
                    return resolve(null); 
                }

                resolve(user); 
            });
        });
    }
}

export default new UserService();