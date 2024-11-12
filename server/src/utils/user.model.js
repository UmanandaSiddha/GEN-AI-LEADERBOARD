import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        publicProfile: {
            type: String,
            required: true,
            unique: true,
            validate: [
                {
                    validator: function (value) {
                        const baseUrl = "https://www.cloudskillsboost.google/public_profiles/";
                        const regex = new RegExp(`^${baseUrl}[a-z0-9-]+$`, 'i'); // Allows alphanumeric and hyphen characters
                        return regex.test(value) && validator.isURL(value);
                    },
                    message: "Invalid URL format"
                }
            ]
        },
        profile: {
            userName: String,
            avatar: String,
            member: String,
        },
        league: {
            title: String,
            body: String,
            points: Number,
            image: String,
        },
        badges: [
            {
                title: String,
                earned: String,
                time: Date,
                image: String,
            }
        ] || [],
    },
    {
        timestamps: true
    }
)

const User = mongoose.model("User", userSchema);
export default User;