import bcrypt from "bcryptjs"

export const HashPassowrd = async (password: string) => {
    const hashedpassowrd = await bcrypt.hash(password, 10)
    return hashedpassowrd
}

export const ComparePassword =  async (password : string ,hashedpassword:string) : Promise<Boolean> => {
    const isPasswordIsCorrect =  await  bcrypt.compare(password , hashedpassword )
    return isPasswordIsCorrect;
}