import mongoose from "mongoose";
import {MONGO_URI} from "../config/mongodb/config";

export const connectDB = async () => {
	try{
		await mongoose.connect(MONGO_URI);
		console.log("Connected to DB");
	}catch(err){
		console.error(err.message);
	}
}

const referralSchema = new mongoose.Schema({
	referralCode: String,
	wallet: String,
	fullUrl: String,
	clickCount: Number
});
export const Referral =  mongoose.model("Referral", referralSchema);

export const getReferralLinkForWallet = async (walletAddress: string) => {
	return Referral.findOne({wallet: walletAddress}).exec();
}
